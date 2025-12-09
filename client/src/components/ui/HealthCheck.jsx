import { Dot } from 'lucide-react';
import { check_health } from "../../utils/hook"
import { setCookie, getCookie } from "../../utils/helpers"
import { useEffect, useState } from 'react';

export default function HealthCheck() {
    const {mutate: healthcheckFunc, isSuccess} = check_health()
    const [isHealthy, setIsHealthy] = useState(false);
    const healthStatus = getCookie("api_health_status");

    useEffect(() => {
    if (healthStatus === "healthy") {
        setIsHealthy(true);
    } else {
        healthcheckFunc(undefined, {
            onSuccess: () => {
                setIsHealthy(true);
                setCookie("api_health_status", "healthy", 1);
            },
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    
    if (!isHealthy) return (<Dot className="w-12 h-12 text-red-500 animate-pulse" />)
    if (isHealthy) return (<Dot className="w-12 h-12 text-green-500 animate-pulse" />)
}
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../ui/Loading"
import { Check, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react'


export function ReportStatus({ reportAnswer, isPending, isSuccess, isError, error }) {
    const navigate = useNavigate();
    const dunno = "¯\\_(ツ)_/¯";
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const msg =
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.response?.data?.msg ||
            "Something went wrong1";

        setErrorMsg(msg);
    }, [error]);


    if (!isPending && !isSuccess && !isError) return null;


    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg">

                {isPending && (
                    <div>
                        <LoadingSpinner />
                        <p className="text-muted-foreground text-sm">Sending your report...</p>
                    </div>)}

                {isSuccess && (
                    <div className="flex flex-col justify-center items-center gap-5">
                        <Check className="text-green-500" />
                        <p className="text-muted-foreground text-sm">Your Report sent successfully sent!</p>
                        <div className="flex flex-row gap-2">
                            <Button size="sm">Open Report</Button>
                            <Button variant="ghost" size="sm">Create new Report</Button>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col justify-center items-center gap-5">
                        <p className="text-red-600 text-xl font-semibold text-center tracking-wide">{dunno}</p>
                        <p className="text-red-500 font-bold text-sm">{errorMsg || '"Something went wrong"'}</p>
                        <div className="flex flex-row gap-2">
                            <Button size="sm">Try send it again</Button>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export function ReportStatus({ reportAnswer, isPending, isSuccess, isError }) {
    const navigate = useNavigate();


    if (!isPending && !isSuccess && !isError) return null;

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg">

                {isPending && (
                    <p>Loading...</p>
                )}

                {isSuccess && (
                    <p>Success!</p>
                )}

                {isError && (
                    <p>Error!</p>
                )}
            </div>
        </div>
    );
}
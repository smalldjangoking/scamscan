// src/components/ReportStatus.jsx
import Lottie from "lottie-react";
import checkmarkAnim from "../../assets/animation.json";
import { Button } from "../ui/Button";

export function ReportStatus({ isPending, isSuccess, isError }) {
    // Ничего не показываем, если нет ни загрузки, ни успеха, ни ошибки
    if (!isPending && !isSuccess && !isError) return null;

    return (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg">
                {isPending && (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm font-medium text-foreground">
                            Processing your report…
                        </p>
                        <p className="text-xs text-muted-foreground">
                            It usually takes just a few seconds. Please don&apos;t close this tab.
                        </p>
                    </div>
                )}

                {isSuccess && (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Lottie
                            animationData={checkmarkAnim}
                            autoplay
                            loop={false}
                            style={{ width: 160, height: 160 }}
                        />

                        <p className="text-base font-semibold text-emerald-500">
                            Report has been sent successfully!
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Thank you for helping ScamScan fight scams.
                        </p>

                        <div className="mt-2 flex gap-2">
                            <Button size="sm">
                                Go to report
                            </Button>
                            <Button size="sm" variant="outline">
                                Create new report
                            </Button>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p className="text-base font-semibold text-destructive">
                            Something went wrong
                        </p>
                        <p className="text-sm text-muted-foreground">
                            We couldn&apos;t send your report. Please try again in a moment.
                        </p>
                        <Button size="sm" variant="outline">
                            OK
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

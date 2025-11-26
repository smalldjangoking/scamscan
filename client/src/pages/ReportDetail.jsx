import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { TiptapViewer } from "../components/TiptapOut.jsx";
import { useState } from "react";
import { BackButton } from '../components/ui/GoBack.jsx'
import { Context } from "../main.jsx";
import { observer } from "mobx-react-lite";
import Comments from "../components/reports/Comments.jsx"

import {
    HatGlasses,
    CalendarDays,
    Eye,
    Share2,
    FileWarning,
    Edit,
    Trash2,
    Copy,
    User,
    Globe
} from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import LoadingSpinner from "../components/ui/Loading.jsx";
import { Tooltip } from "react-tooltip";
import { useSingleReport } from "../utils/hook.js"
import ShareButtons from "../components/report/Share.jsx"


export default observer(function ReportDetail() {
    const { store } = useContext(Context)
    const [copied, setCopied] = useState(false);
    const { id, slug } = useParams();
    const { data: reportData, isLoading: reportIsLoading, isError: reportIsError } = useSingleReport(id);
    const [shareOpen, setShareOpen] = useState(false)





    return (
        <section className="relative min-h-screen" >
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <div className="flex justify-between items-center mb-5">
                    <BackButton />

                    {reportData?.user && store.userId === reportData.report.user_id && (
                        <div className="flex items-center ml-auto">
                            <Button variant='ghost'>
                                <Edit />
                            </Button>
                            <Button variant='ghost'>
                                <Trash2 />
                            </Button>
                        </div>
                    )}
                </div>


                {/* Report Card */}
                {
                    reportIsLoading ? (
                        <div className="col-span-full flex justify-center items-center py-20 flex flex-col">
                            <LoadingSpinner />
                            <p className="text-sm text-muted-foreground">Loading Report...</p>
                        </div>
                    ) : reportIsError ? (
                        <div>Error</div>
                    ) : reportData?.report ? (
                        (
                            <div
                                className="flex flex-col gap-2 border rounded-xl bg-card/80 backdrop-blur-sm pt-5 pl-5 pr-5 pb-2 shadow-sm">
                                <div className="flex justify-between items-center border-b pb-4">
                                    {shareOpen && (
                                        <ShareButtons
                                            title={`Report: ${reportData?.report.crypto_name} | Scamscan.io`}
                                            onClose={() => setShareOpen(false)}
                                        />
                                    )}
                                    <div className="flex items-center">
                                        {reportData.user ? (
                                            <div className="flex items-center gap-2">
                                                <User
                                                    className="h-6 w-6 rounded-full border"
                                                />
                                                <div>
                                                    <p className="font-medium">{reportData.user.nickname}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <HatGlasses className="h-6 w-6" />
                                                <span>Anonymous Reporter</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                                        <CalendarDays
                                            className="h-4 w-4"
                                            data-tooltip-id="info-tooltip"
                                            data-tooltip-content="Date of Creation"
                                        />
                                        {new Date(reportData.report.created_at).toLocaleString()}
                                    </div>
                                </div>

                                {/* Inside */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title</span>
                                    <h2 className="text-lg font-semibold">{reportData.report.report_title}</h2>
                                </div>
                                <div className="inline-flex flex-col w-fit max-w-full gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Report address
                                    </span>

                                    <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                                        {/* Левая часть: иконка + адрес */}
                                        <div className="flex items-center gap-2 min-w-0">
                                            {reportData?.address.website_url ? (
                                                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            ) : (
                                                <img
                                                    className="h-5 w-5 shrink-0 rounded-sm"
                                                    src={reportData.address.crypto_logo_url}
                                                    alt={reportData.address.crypto_name}
                                                />
                                            )}

                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs text-muted-foreground">
                                                    {reportData?.address.website_url
                                                        ? "Website"
                                                        : reportData.address.crypto_name}
                                                </span>
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {reportData?.address.website_url
                                                        ? reportData.address.website_url
                                                        : reportData.address.crypto_address}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Правая часть: действия */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            {/* Копировать */}
                                            <Button
                                                onClick={() => {
                                                    const value =
                                                        reportData?.address.website_url ||
                                                        reportData?.address.crypto_address;

                                                    navigator.clipboard.writeText(value);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 500);
                                                }}
                                                variant="outline"
                                                size="icon"
                                                className="hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-3 w-[110px]"
                                                title={copied ? "Copied!" : "Copy address"}
                                            >
                                                <span className="inline-block w-[70px] text-left">
                                                    {copied ? "Copied!" : "Copy address"}
                                                </span>

                                                <Copy
                                                    className={`h-4 w-4 transition-opacity duration-200 ${copied ? "opacity-70" : "opacity-100"
                                                        }`}
                                                />
                                            </Button>

                                        </div>
                                    </div>
                                </div>



                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</span>
                                    <TiptapViewer html={reportData?.report.report_description} />
                                </div>

                                <div className="flex justify-between items-center border-t pt-2">
                                    {/* Views */}
                                    <div className="flex items-center gap-2">
                                        <Eye
                                            className="h-5 w-5 text-muted-foreground"
                                            data-tooltip-id="info-tooltip"
                                            data-tooltip-content="Amount of Views"

                                        />
                                        <span className="font-medium text-muted-foreground">{reportData?.report.views}</span>
                                    </div>

                                    {/* Share Button */}
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-muted-foreground"
                                        onClick={() => setShareOpen(true)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-1 items-center justify-center min-h-[250px]">
                            <div className="text-center">
                                <div
                                    className="mx-auto mb-4 h-14 w-14 rounded-full border border-dashed flex items-center justify-center">
                                    <FileWarning className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">
                                    Failed to load!
                                </p>
                            </div>
                        </div>
                    )
                }
                {/* Comments Section */}
                {!reportIsLoading && (
                    <Comments reportId={id} />
                )}

            </div>

            <Tooltip id="info-tooltip" />
        </section >
    );
})

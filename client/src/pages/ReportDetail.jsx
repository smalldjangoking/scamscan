import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TiptapViewer from "../components/reports/ReportDescription.jsx";

import {
    ArrowLeft,
    MessageSquare,
    Shield,
    CalendarDays,
    Eye,
    Share2,
    FileWarning,
    Edit,
    Trash2,
    Copy,
    Globe
} from "lucide-react";
import { Button } from "../components/ui/Button.jsx";
import LoadingSpinner from "../components/ui/Loading.jsx";
import { Tooltip } from "react-tooltip";
import { useComments, useSingleReport } from "../utils/hook.js"
import Input from "../components/ui/Input.jsx";

export default function ReportDetail() {
    const navigate = useNavigate();
    const { id, slug } = useParams();

    console.log('id', id, typeof (id))

    const { data: reportData, isLoading: reportIsLoading, isError: reportIsError } = useSingleReport(id);
    const { data: commentData, isLoading: commentIsLoading, isError: commentIsError } = useComments(id);

    const isLoading = false;
    const report = {
        user: {
            nickname: "CryptoHunter",
            avatar_url: "/avatar1.png",
            is_anonymous: false,
        },
        comments: [
            { id: 1, user: "Anonymous", text: "Thanks for warning!", created_at: "2025-10-19T11:32:00" },
            {
                id: 2,
                user: "ProtectedUser",
                text: "Reported to Binance security team.",
                created_at: "2025-10-19T12:10:00"
            },
        ],
    };

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner />
                <p className="text-sm text-muted-foreground mt-3">
                    Loading report details...
                </p>
            </div>
        );

    return (
        <section className="relative min-h-screen">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative container mx-auto py-10 px-2 md:py-20">
                <div className="flex justify-between items-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="ghost"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Button>


                    <div className="flex items-center">
                        <Button variant='ghost'>
                            <Edit />
                        </Button>
                        <Button variant='ghost'>
                            <Trash2 />
                        </Button>

                    </div>
                </div>


                {/* Report Card */}
                {
                    reportIsLoading ? (
                        <div className="col-span-full flex justify-center items-center py-20">
                            <LoadingSpinner />
                        </div>
                    ) : reportIsError ? (
                        <div>Error</div>
                    ) : reportData?.report ? (
                        (
                            <div
                                className="flex flex-col gap-2 border rounded-xl bg-card/80 backdrop-blur-sm pt-5 pl-5 pr-5 pb-2 shadow-sm">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <div className="flex items-center">
                                        {report.user.is_anonymous ? (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Shield className="h-6 w-6" />
                                                <span>Anonymous Reporter</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <img
                                                    className="h-10 w-10 rounded-full border"
                                                />
                                                <div>
                                                    <p className="font-medium">{report.user.nickname}</p>
                                                </div>
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
                                    <span className="text-muted-foreground text-sm">Title</span>
                                    <h2 className="text-lg font-semibold">{reportData.report.report_title}</h2>
                                </div>
                                <div className="flex flex-col max-w-fit gap-2">
                                    <span className="text-muted-foreground text-sm">Report Address</span>
                                    <div className="flex flex-row gap-2 ">
                                        <div className="flex flex-1 min-w-0">
                                            <Button
                                                title="All Reports"
                                            >
                                                {reportData?.address.website_url ?
                                                    (<p className="flex items-center gap-1">
                                                        <Globe /> {reportData.address.website_url}</p>)
                                                    :
                                                    (<p className="flex items-center gap-1"><img className="w-6 h-6"
                                                        src={reportData.address.crypto_logo_url}
                                                        alt={reportData.address.crypto_name} />
                                                        {reportData.address.crypto_address}</p>)}
                                            </Button>
                                        </div>

                                        {/* Copy */}
                                        <Button
                                            onClick={() => navigator.clipboard.writeText(
                                                reportData?.address.website_url || reportData?.address.crypto_address
                                            )}
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0 hover:bg-accent hover:text-accent-foreground"
                                            title="Copy address"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-muted-foreground text-sm">Description</span>
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
                                        <span className="font-medium text-muted-foreground">0</span>
                                    </div>

                                    {/* Share Button */}
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 text-muted-foreground"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        <span>Share</span>
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
                                    123
                                </p>
                            </div>
                        </div>
                    )
                }

                {/* Comments Section */}
                <div className="mt-10 border rounded-xl bg-card/80 backdrop-blur-sm p-6">
                    <h3 className="flex items-center gap-2 mb-4">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <p className="font-semibold text-foreground">Comments ({report.comments.length})</p>
                    </h3>

                    <div className="w-full rounded-lg border p-4 bg-card/50 backdrop-blur-sm">
                        <div className="flex items-stretch gap-3">
                            <div className="flex items-center justify-center">
                                {report.user.is_anonymous ? (
                                    <div className="flex items-center justify-center text-muted-foreground">
                                        <Shield className="h-8 w-8" />
                                    </div>
                                ) : (
                                    <img
                                        src={report.user.avatar_url || "/default-avatar.png"}
                                        className="h-10 w-10 rounded-full border object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col justify-center flex-1">
                                <Input label="Add comment" placeholder="Write your comment..." />
                            </div>
                        </div>

                        <div className="flex justify-end mt-3">
                            <Button size="sm" variant="ghost">
                                Submit
                            </Button>
                        </div>
                    </div>


                    {report.comments.length > 0 ? (
                        <ul className="space-y-4">
                            {report.comments.map((comment) => (
                                <li key={comment.id} className="border rounded-lg p-3 bg-background/60">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">{comment.user}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{comment.text}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-8">
                            No comments yet. Be the first to share your thoughts!
                        </p>
                    )}
                </div>
            </div>
            <Tooltip id="info-tooltip" />
        </section>
    );
}

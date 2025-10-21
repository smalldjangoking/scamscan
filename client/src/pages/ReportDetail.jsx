import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, MessageSquare, UserCircle2, Shield, Clock8} from "lucide-react";
import {Button} from "../components/ui/Button.jsx";
import LoadingSpinner from "../components/ui/Loading.jsx";

export default function ReportDetail() {
    const navigate = useNavigate();

    // Здесь можно использовать хук, который получает конкретный отчёт
    // const { data: report, isLoading, isError } = useReportDetail(id);

    const isLoading = false;
    const report = {
        report_title: "Fake Exchange asking for wallet seed",
        report_description:
            "I received an email pretending to be from Binance support, asking to verify my wallet seed phrase. The link led to a phishing site.",
        created_at: "2025-10-18T14:22:00",
        user: {
            nickname: "CryptoHunter",
            avatar_url: "/avatar1.png",
            is_anonymous: false,
        },
        comments: [
            {id: 1, user: "Anonymous", text: "Thanks for warning!", created_at: "2025-10-19T11:32:00"},
            {id: 2, user: "ProtectedUser", text: "Reported to Binance security team.", created_at: "2025-10-19T12:10:00"},
        ],
    };

    if (isLoading)
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner/>
                <p className="text-sm text-muted-foreground mt-3">
                    Loading report details...
                </p>
            </div>
        );

    return (
        <section className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"/>
            <div className="relative container mx-auto py-10 px-2 md:py-20">

                {/* Back Button */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition"
                >
                    <ArrowLeft className="h-4 w-4"/>
                    <span>Back</span>
                </Button>

                {/* Report Card */}
                <div className="border rounded-xl bg-card/80 backdrop-blur-sm p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 border-b pb-4">
                            {report.user.is_anonymous ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Shield className="h-6 w-6"/>
                                    <span>Anonymous Reporter</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <img
                                        className="h-10 w-10 rounded-full border"
                                    />
                                    <div>
                                        <p className="font-medium">{report.user.nickname}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                            <Clock8 className="h-4 w-4"/>
                            {new Date(report.created_at).toLocaleString()}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-3 mt-5">{report.report_title}</h2>

                    <p className="text-base leading-relaxed text-foreground/90 mb-8">
                        {report.report_description}
                    </p>
                </div>

                {/* Comments Section */}
                <div className="mt-10 border rounded-xl bg-card/80 backdrop-blur-sm p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <MessageSquare className="h-5 w-5 text-accent"/>
                        Comments ({report.comments.length})
                    </h3>

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

                    {/* Comment Form */}
                    <div className="mt-6 border-t pt-4">
                        <Button className="mt-3">Post Comment</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

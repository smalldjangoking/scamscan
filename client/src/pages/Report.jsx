import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import ReportForm from "../components/ui/ReportForm";
import {Coins, Globe, Plus, HelpCircle, SquareDashedTopSolid, MoveLeft, Cog, BadgeCheck, ShieldUser, UserX, Shield, MessageCircle, CheckCircle, TrendingUp, History, AlertTriangle, Users, Eye } from 'lucide-react';

function Report() {
    const [step, setStep] = useState(1);
    const accessToken = localStorage.getItem("access_token"); // Исправлено название ключа

    useEffect(() => {
        if (accessToken) {
            setStep(2);
        }
    }, [accessToken]);

    return (
        <>
            <section className="relative">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="relative container mx-auto px-4 py-20 md:py-28">
                    {/* Register proposal */}
                    {step === 1 && (
                        <>
                            {/* Header */}
                            <div className="mx-auto mb-12 max-w-6xl text-center">
                                <h1 className="mb-4 text-4xl tracking-tight md:text-5xl">
                                    Choose Your <span className="text-primary">Protection Level</span>
                                </h1>
                                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                                    Join our community to unlock powerful features and help make the internet safer for everyone.
                                </p>
                            </div>

                            {/* Content */}
                            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
                                {/* Registered User Card */}
                                <div className="group relative cursor-pointer" onClick={() => { console.log('lox') } }>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-50 blur-xl transition-opacity group-hover:opacity-75"></div>
                                    <div className="relative rounded-2xl border border-border bg-card/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                                        <div className="mb-6 text-center">
                                            <div className="relative mx-auto mb-4 h-24 w-24">
                                                <ShieldUser size={100} />
                                            </div>
                                            <h3 className="mb-2 text-2xl font-bold text-primary">Protected Member</h3>
                                            <p className="text-muted-foreground text-sm">Full security features unlocked</p>
                                        </div>

                                        <fieldset class="border border-green-400 p-4 rounded">
                                            <legend class="px-2 flex flex-row gap-2 items-center">
                                                <SquareDashedTopSolid className="text-primary" />
                                                <span className="text-sm font-medium">Get a green border</span>
                                            </legend>
                                            <div className="flex items-center gap-3 border-primary/20 p-3">
                                                <Cog className="h-5 w-5 flex-shrink-0 text-primary" />
                                                <span className="text-sm font-medium">Full control over your reports</span>
                                            </div>
                                            <div className="flex items-center gap-3 border-primary/20 p-3">
                                                <MessageCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                                                <span className="text-sm font-medium">Access to comment section</span>
                                            </div>
                                            <div className="flex items-center gap-3 border-primary/20 p-3">
                                                <BadgeCheck className="h-5 w-5 flex-shrink-0 text-blue-400" />
                                                <span className="text-sm font-medium">Verified community badge</span>
                                            </div>
                                            <div className="flex items-center gap-3 border-primary/20 p-3">
                                                <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary" />
                                                <span className="text-sm font-medium">Earn reputation points</span>
                                            </div>
                                            <div className="flex items-center gap-3 border-primary/20 p-3">
                                                <History className="h-5 w-5 flex-shrink-0 text-primary" />
                                                <span className="text-sm font-medium">Save & view search history</span>
                                            </div>
                                        </fieldset>

                                                

                                        <div className="mt-8 flex w-full">
                                            <Button size="lg" className="w-full">
                                                Get Protected Now
                                                <Shield className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Unregistered User Card */}
                                <div className="group relative cursor-pointer" onClick={() => setStep(2) }>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-30 blur-xl transition-opacity group-hover:opacity-50"></div>
    <div className="relative rounded-2xl border border-border/50 bg-card/60 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="mb-6 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24">
                <UserX size={100} />
            </div>
            <h3 className="text-muted-foreground mb-2 text-2xl font-bold">Anonymous User</h3>
            <p className="text-muted-foreground text-sm">Limited access & features</p>
        </div>

        <fieldset className="border-grey-400 rounded border p-4 opacity-70">
            <legend className="flex flex-row items-center gap-2 px-2">
                <SquareDashedTopSolid className="text-grey-400" />
                <span className="text-muted-foreground text-sm font-medium">Limited features</span>
            </legend>
            <div className="flex items-center gap-3 border-red-400/20 p-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
                <span className="text-muted-foreground text-sm line-through">No control over reports</span>
            </div>
            <div className="flex items-center gap-3 border-red-400/20 p-3">
                <MessageCircle className="h-5 w-5 flex-shrink-0 text-red-500 opacity-50" />
                <span className="text-muted-foreground text-sm line-through">Comments are disabled</span>
            </div>
            <div className="flex items-center gap-3 border-red-400/20 p-3">
                <TrendingUp className="h-5 w-5 flex-shrink-0 text-gray-500 opacity-50" />
                <span className="text-muted-foreground text-sm line-through">No reputation system</span>
            </div>
            <div className="flex items-center gap-3 border-red-400/20 p-3">
                <Eye className="h-5 w-5 flex-shrink-0 text-gray-500 opacity-50" />
                <span className="text-muted-foreground text-sm line-through">No search history saved</span>
            </div>
             <div className="flex items-center gap-3 border-red-400/20 p-3">
                <Users className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <span className="text-muted-foreground text-sm">May appear as suspicious</span>
             </div>
        </fieldset>

        <div className="mt-8 flex w-full">
            <Button variant="outline" size="lg" className="border-muted-foreground/20 w-full">
                Continue as Guest
                <UserX className="ml-2 h-4 w-4" />
            </Button>
                </div>
            </div>
        </div>
    </div>

               {/* Bottom CTA */}
               <div className="mt-12 text-center">
                   <p className="text-muted-foreground mb-4">
                       Join <span className="font-semibold text-primary">thousands</span> of users protecting the community
                   </p>
                   <Button onClick={() => window.location.href = '/'} variant="ghost" size="sm">
                       <MoveLeft className="mr-2 h-4 w-4" />
                       Go back
                   </Button>
               </div>
           </>
                    )}

                    {step === 2 && (
                        <>
                            {/* Header */}
                            <div className="mx-auto mb-12 max-w-6xl text-center">
                                <h1 className="mb-4 text-4xl tracking-tight md:text-5xl">
                                    Fraud <span className="text-primary">Report</span> Submission
                                </h1>
                                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                                    By sharing accurate details, you help protect others from fraud and make it easier to identify scammers
                                </p>
                            </div>


                            {/* Content */}
                            <ReportForm />

                        
                        </>
                    )}

                </div>
            </section>
        </>
    )
}

export default Report;
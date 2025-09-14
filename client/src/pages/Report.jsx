import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Coins, Globe, Plus, HelpCircle, SquareDashedTopSolid, MoveLeft, Cog, BadgeCheck, ShieldUser, UserX, Shield, MessageCircle, CheckCircle, TrendingUp, History, AlertTriangle, Users, Eye } from 'lucide-react';

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
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                <div className="container mx-auto px-4 py-20 md:py-28 relative">
                    {/* Register proposal */}
                    {step === 1 && (
                        <>
                            {/* Header */}
                            <div className="max-w-6xl mx-auto mb-12 text-center">
                                <h1 className="text-4xl md:text-5xl tracking-tight mb-4">
                                    Choose Your <span className="text-primary">Protection Level</span>
                                </h1>
                                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                                    Join our community to unlock powerful features and help make the internet safer for everyone.
                                </p>
                            </div>

                            {/* Content */}
                            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                                {/* Registered User Card */}
                                <div className="relative group cursor-pointer" onClick={() => { console.log('lox') } }>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                    <div className="relative bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
                                        <div className="text-center mb-6">
                                            <div className="relative mx-auto w-24 h-24 mb-4">
                                                <ShieldUser size={100} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-primary mb-2">Protected Member</h3>
                                            <p className="text-sm text-muted-foreground">Full security features unlocked</p>
                                        </div>

                                        <fieldset class="border border-green-400 p-4 rounded">
                                            <legend class="px-2 flex flex-row gap-2 items-center">
                                                <SquareDashedTopSolid className="text-primary" />
                                                <span className="text-sm font-medium">Get a green border</span>
                                            </legend>
                                            <div className="flex items-center gap-3 p-3 border-primary/20">
                                                <Cog className="h-5 w-5 text-primary flex-shrink-0" />
                                                <span className="text-sm font-medium">Full control over your reports</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 border-primary/20">
                                                <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                                <span className="text-sm font-medium">Access to comment section</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 border-primary/20">
                                                <BadgeCheck className="h-5 w-5 text-blue-400 flex-shrink-0" />
                                                <span className="text-sm font-medium">Verified community badge</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 border-primary/20">
                                                <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                                                <span className="text-sm font-medium">Earn reputation points</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 border-primary/20">
                                                <History className="h-5 w-5 text-primary flex-shrink-0" />
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
                                <div className="relative group cursor-pointer" onClick={() => setStep(2) }>
    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
    <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm p-8 hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-6">
            <div className="relative mx-auto w-24 h-24 mb-4">
                <UserX size={100} />
            </div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">Anonymous User</h3>
            <p className="text-sm text-muted-foreground">Limited access & features</p>
        </div>

        <fieldset className="border border-red-400 p-4 rounded opacity-70">
            <legend className="px-2 flex flex-row gap-2 items-center">
                <SquareDashedTopSolid className="text-red-400" />
                <span className="text-sm font-medium text-muted-foreground">Limited features</span>
            </legend>
            <div className="flex items-center gap-3 p-3 border-red-400/20">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground line-through">No control over reports</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-red-400/20">
                <MessageCircle className="h-5 w-5 text-red-500 flex-shrink-0 opacity-50" />
                <span className="text-sm text-muted-foreground line-through">Comments are disabled</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-red-400/20">
                <TrendingUp className="h-5 w-5 text-gray-500 flex-shrink-0 opacity-50" />
                <span className="text-sm text-muted-foreground line-through">No reputation system</span>
            </div>
            <div className="flex items-center gap-3 p-3 border-red-400/20">
                <Eye className="h-5 w-5 text-gray-500 flex-shrink-0 opacity-50" />
                <span className="text-sm text-muted-foreground line-through">No search history saved</span>
            </div>
             <div className="flex items-center gap-3 p-3 border-red-400/20">
                <Users className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">May appear as suspicious</span>
             </div>
        </fieldset>

        <div className="mt-8 flex w-full">
            <Button variant="outline" size="lg" className="w-full border-muted-foreground/20">
                Continue as Guest
                <UserX className="ml-2 h-4 w-4" />
            </Button>
                </div>
            </div>
        </div>
    </div>

               {/* Bottom CTA */}
               <div className="text-center mt-12">
                   <p className="text-muted-foreground mb-4">
                       Join <span className="text-primary font-semibold">thousands</span> of users protecting the community
                   </p>
                   <Button onClick={() => window.location.href = '/'} variant="ghost" size="sm">
                       <MoveLeft className="mr-2 h-4 w-4" />
                       Go back
                   </Button>
               </div>
           </>
       )}

                </div>
            </section>
        </>
    )
}

export default Report;
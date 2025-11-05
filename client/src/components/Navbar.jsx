import React, { useState } from 'react'
import { Shield, ArrowRight, User } from "lucide-react"
import { ThemeToggle } from "./ui/ThemeToggle.jsx";
import { Button } from "./ui/Button.jsx";
import Authentication from "./Authentication.jsx";

function Navbar() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authVariant, setAuthVariant] = useState('register');
    const toggleAuth = () => setIsAuthOpen(prev => !prev);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"))

    const openAuth = (variant) => {
        setAuthVariant(variant);
        toggleAuth();
    };


    return (
        <>
            <Authentication isOpen={isAuthOpen} onClose={toggleAuth} authVar={authVariant} />

            <header
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-lg font-semibold">scamscan.io</span>
                            <div className="text-xs text-muted-foreground">report & observe</div>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Explore</a>
                        <a href="/scan"
                           className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Scan</a>
                        <a href="/report"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Report</a>
                        <a href="/reports"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">All Reports</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {!accessToken ? (
                            <>
                                <Button onClick={() => openAuth('login')} variant="ghost" size="sm">Sign In</Button>
                                <Button onClick={() => openAuth('register')} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Get Started
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </>
                        ) : (
                            <>
                                    <Button onClick={() => window.location.href = '/profile' } size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <span className="font-medium tracking-wide">Profile</span>
                                        <User className="ml-1 h-6 w-6" />
                                    </Button>
                            </>
                        )}

                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar;
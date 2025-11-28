import React, { useState, useContext } from 'react'
import { Shield, ArrowRight, User, Menu } from "lucide-react"
import { ThemeToggle } from "./ui/ThemeToggle.jsx";
import { Button } from "./ui/Button.jsx";
import Authentication from "./Authentication.jsx";
import { Context } from "../main";
import { observer } from "mobx-react-lite";
import BurgerMenu from "./navbar/BurgerMenu"
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false)
    const [authVariant, setAuthVariant] = useState('register');
    const toggleAuth = () => setIsAuthOpen(prev => !prev);
    const toggleBurger = () => setIsBurgerOpen(prev => !prev);
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const openAuth = (variant) => {
        setAuthVariant(variant);
        toggleAuth();
    };


    return (
        <>
            <Authentication isOpen={isAuthOpen} onClose={toggleAuth} authVar={authVariant} />

            <BurgerMenu isOpen={isBurgerOpen} onClose={toggleBurger} openAuth={toggleAuth} />

            <header
                className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                        {[{ address: "/", label: "Explore" },
                        { address: "/scan", label: "Scan" },
                        { address: "/report", label: "Report" },
                        { address: "/reports", label: "All Reports" }
                        ].map((item) => (
                            <a
                                key={item.address}
                                onClick={() => navigate(item.address)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer">{item.label}
                            </a>
                        ))}
                    </nav>
                    {/*Desktop*/}
                    <div className="items-center gap-3 hidden md:flex">
                        <ThemeToggle />
                        {!store.accessToken ? (
                            <>
                                <Button onClick={() => openAuth('login')} variant="ghost" size="sm">Sign In</Button>
                                <Button onClick={() => openAuth('register')} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Get Started
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/profile')} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <span className="font-medium tracking-wide">Profile</span>
                                    <User className="ml-1 h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/*Mobile*/}
                    <div className="items-center gap-3 flex md:hidden">
                        <Button onClick={() => setIsBurgerOpen(true)} variant="outline">
                            <Menu />
                        </Button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default observer(Navbar);
import { useEffect, useContext } from "react"
import { ThemeToggle } from "../ui/ThemeToggle";
import { Context } from "../../main"
import { Button } from "../ui/Button"
import { KeySquare, User, Shield, X } from "lucide-react"
import { useNavigate } from 'react-router-dom';

export default function BurgerMenu({ isOpen, onClose, openAuth }) {
    const { store } = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden")
        }
        return () => document.body.classList.remove("overflow-hidden")
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <div className="
            fixed inset-0 z-40 
            bg-background/95 backdrop-blur 
            supports-[backdrop-filter]:bg-background/60
        ">
            <div className="flex justify-between mt-5 mx-5">
                <div className="flex flex-row gap-2 items-center">
                    <div className="items-center gap-3">
                        {!store.accessToken ? (
                            <>
                                <Button onClick={openAuth} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Account
                                    <KeySquare className="ml-1 h-3 w-3" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => window.location.href = '/profile'} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <span className="font-medium tracking-wide">Profile</span>
                                    <User className="ml-1 h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    <ThemeToggle />
                </div>

                <div>
                    <Button
                        className="group"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="group-hover:rotate-255 transition-normal" />
                    </Button>
                </div>
            </div>

            <nav className="flex flex-col items-center gap-3 mt-20 w-full px-10">
                {[
                    { address: "/", label: "Explore" },
                    { address: "/scan", label: "Scan" },
                    { address: "/report", label: "Report" },
                    { address: "/reports", label: "All Reports" },
                ].map((item) => (
                    <a
                        key={item.address}
                        onClick={() => {
                            navigate(item.address);
                            onClose(); // чтобы бургер закрывался после клика
                        }}
                        className="
                w-full py-3
                rounded-xl 
                text-center
                text-base font-medium
                bg-muted/40
                text-muted-foreground
                hover:bg-muted/60
                hover:text-foreground
                transition-all
                backdrop-blur-sm
                border border-border/40
                shadow-sm
            "
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="flex flex-col items-center gap-3 mt-20 w-full px-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-lg font-semibold">scamscan.io</span>
                        <div className="text-xs text-muted-foreground">report & observe</div>
                    </div>
                </div>
            </div>

        </div>
    )
}

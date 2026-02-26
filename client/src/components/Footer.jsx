import { Shield } from "lucide-react"
import { Button } from "./ui/Button.jsx";
import { useNavigate } from 'react-router-dom';
import HealthCheck from "./ui/HealthCheck.jsx";

function Footer() {
    const navigate = useNavigate();

    const navscroll = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    return (
        <>
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="font-semibold">scamscan.io</span>
                                    <div className="text-xs text-muted-foreground">report & observe</div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                Making the internet safer through community-driven fraud prevention and reporting.
                            </p>
                            <div className="flex gap-4">
                                {/* platform social media place */}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {[{ address: "/", label: "Explore" },
                                { address: "/scan", label: "Scan" },
                                { address: "/report", label: "Report" },
                                { address: "/reports", label: "All Reports" }
                                ].map((item) => (
                                    <li key={item.address} onClick={() => navscroll(item.address)} id={item.address} className="cursor-pointer">
                                        <p className="hover:text-foreground transition-colors">{item.label}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {[{ address: "/legal/privacy-policy", label: "Privacy Policy" },
                                { address: "/legal/terms-of-service", label: "Terms of service" },
                                { address: "/legal/cookie-policy", label: "Cookie Policy" },
                                ].map((item) => (
                                    <li key={item.address} onClick={() => navscroll(item.address)} id={item.address} className="cursor-pointer">
                                        <p className="hover:text-foreground transition-colors">{item.label}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Other</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {[
                                    { address: "/about-us", label: "About us", external: false },
                                    { address: "/contact", label: "Contact", external: false },
                                    {
                                        address: "https://api.scamscan.io/docs",
                                        label: "API",
                                        external: true
                                    },
                                ].map((item) => (
                                    <li
                                        key={item.address}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (item.external) {
                                                window.open(item.address, "_blank");
                                            } else {
                                                navscroll(item.address);
                                            }
                                        }}
                                    >
                                        <p className="hover:text-foreground transition-colors">
                                            {item.label}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 scamscan.io. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <p className="flex flex-row items-center justify-center">API Status <HealthCheck /></p>
                            <p>version: <span className="font-bold text-sm">1.3.0-beta</span></p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;
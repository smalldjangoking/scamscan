import React from 'react'
import { Shield } from "lucide-react"
import {Button} from "./ui/Button.jsx";

function Footer() {
    return (
        <>
            <footer className="border-t bg-muted/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                                    <Shield className="h-5 w-5"/>
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
                                <Button variant="ghost" size="sm" className="p-2">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </Button>
                                <Button variant="ghost" size="sm" className="p-2">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Report Scammer</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Check Address</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Browse Reports</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">API Access</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Community</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Discussion Forum</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Guidelines</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
                                </li>
                                <li><a href="#" className="hover:text-foreground transition-colors">GDPR Compliance</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © 2025 scamscan.io. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>123</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;
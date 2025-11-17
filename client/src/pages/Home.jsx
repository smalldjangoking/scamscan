import { Button } from "../components/ui/Button.jsx"
import { AlertTriangle, Badge, BookText, Star } from "lucide-react"
import { Input } from "../components/ui/Input.jsx"
import { ArrowRight, Search } from "lucide-react"
import {useNavigate} from "react-router-dom";
import { useState } from "react";


function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');


    return (
        <>
            <section className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="container mx-auto px-4 py-24 md:py-32 relative">
                    <div className="max-w-5xl mx-auto text-center">
                        <Badge variant="secondary" className="mb-8 px-4 py-2">
                            <Star className="mr-2 h-3 w-3" />
                            100% Free • No Ads • No Tracking
                        </Badge>

                        <div className="mb-12">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-8">
                                Stop Feeding
                                <span className="block text-primary">Scammers</span>
                            </h1>

                            {/* Colorful Hashtag-style Action Words */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-2 rounded-full shadow-lg border border-blue-400/30">
                                        <span className="text-xl md:text-1xl font-semibold">#Scan</span>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full shadow-lg border border-red-400/30">
                                        <span className="text-xl md:text-1xl font-semibold">#Expose</span>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full shadow-lg border border-green-400/30">
                                        <span className="text-xl md:text-1xl font-semibold">#MoveOn</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                            Don't let scammers profit from deception. Scan any website or crypto address instantly,
                            report fraudulent activities, and help protect the community
                        </p>

                        {/* Search Field */}
                        <div className="mb-5 w-full md:w-1/2 md:mx-auto ">
                            <Input value={search} callBack={setSearch} placeholder={"Enter website URL or crypto address to scan..."} icon={Search} />
                            <div className="mt-3">
                                <Button>Scan</Button>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button onClick={() => window.location.href = '/report'} size="lg"
                                className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90">
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Report a Scammer
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button onClick={() => window.location.href = '/reports'} size="lg" variant="outline" className="px-8 py-4">
                                <BookText className="mr-2 h-5 w-5" />
                                Browse Reports
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;
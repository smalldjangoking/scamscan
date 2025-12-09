import SeoHead from "../components/Seo";

export default function AboutUs() {
    return (
        <section className="relative">
            <SeoHead
                title="About Us — ScamScan.io"
                description="Learn about ScamScan.io, our mission, community-driven reporting system, and how we help users detect and avoid crypto scams."
                canonicalUrl="https://scamscan.io/about"
                robots="index,follow"
                ogType="website"
                ogImage="https://scamscan.io/static/logo.svg"
                twitterCard="summary_large_image"
                twitterImage="https://scamscan.io/static/logo.svg"
            />

            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="container mx-auto px-4 py-20 md:py-28 relative">
                
                {/* Header */}
                <div className="mx-auto mb-12 max-w-5xl text-center">
                    <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
                        ABOUT US
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        ScamScan.io is an independent platform for detecting, reporting, 
                        and analyzing crypto-related scams. We empower users with transparent 
                        data, community insights, and automated risk checks.
                    </p>
                </div>

                {/* Content card */}
                <div className="mx-auto max-w-5xl rounded-2xl border bg-card/60 p-6 md:p-10 shadow-sm backdrop-blur">
                    <div className="space-y-10 text-muted-foreground text-[15px] md:text-base leading-relaxed">

                        {/* Mission */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">Our Mission</h2>
                            <p>
                                Our mission is simple — to make the crypto space safer. 
                                Every day, thousands of users lose funds to phishing websites, 
                                fake exchanges, fraudulent investment schemes, and deceptive 
                                blockchain addresses. ScamScan.io provides tools that allow 
                                anyone to verify risks quickly and transparently.
                            </p>
                        </div>

                        {/* What We Do */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">What We Do</h2>
                            <p>
                                ScamScan.io collects user-generated reports and enriches them 
                                with automated checks such as WHOIS data, domain risk indicators, 
                                and reputation scoring. Our platform allows you to:
                            </p>
                            <ul className="list-disc ml-6 mt-3 space-y-1">
                                <li>Report suspicious websites or crypto wallet addresses</li>
                                <li>Check community feedback and scam alerts</li>
                                <li>Review domain metadata and creation history</li>
                                <li>See reputation scores based on user votes</li>
                                <li>Participate in discussions and help others stay safe</li>
                            </ul>
                        </div>

                        {/* Why It Matters */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">Why It Matters</h2>
                            <p>
                                Crypto fraud evolves faster than traditional security tools. Users 
                                often encounter misleading advertisements, malicious links, and 
                                high-pressure tactics designed to extract money. ScamScan.io gives 
                                individuals reliable information and the ability to make safer decisions.
                            </p>
                        </div>

                        {/* Principles */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">Our Principles</h2>
                            <ul className="list-disc ml-6 space-y-1">
                                <li>
                                    <strong>Transparency:</strong> All reports, votes, and data 
                                    are openly accessible. No hidden algorithms or paywalls.
                                </li>
                                <li>
                                    <strong>Community-Driven:</strong> The strength of the platform 
                                    comes from real user contributions.
                                </li>
                                <li>
                                    <strong>Independence:</strong> ScamScan.io is not affiliated 
                                    with cryptocurrency exchanges or advertisers.
                                </li>
                            </ul>
                        </div>

                        {/* Future */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">The Future of ScamScan.io</h2>
                            <p>
                                We are committed to expanding ScamScan.io by integrating blockchain 
                                analysis tools, API access for developers, automated detection models, 
                                improved trust metrics, and a mobile-friendly experience. Our long-term 
                                vision is to build the world’s largest open database of crypto scams.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="pt-4">
                            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                            <p>
                                Have questions, suggestions, or partnership inquiries?  
                                Reach out to us anytime at:{" "}
                                <a
                                    href="mailto:contact@scamscan.io"
                                    className="text-primary underline underline-offset-2"
                                >
                                    contact@scamscan.io
                                </a>
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

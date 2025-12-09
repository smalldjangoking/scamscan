import SeoHead from "../components/Seo";

export default function Contact() {
    return (
        <section className="relative">
            <SeoHead
                title="Contact Us — ScamScan.io"
                description="Get in touch with the ScamScan.io team for questions, support, privacy concerns, or legal inquiries."
                canonicalUrl="https://scamscan.io/contact"
                robots="index,follow"
                ogType="website"
                ogImage="https://scamscan.io/static/logo.svg"
                twitterCard="summary_large_image"
                twitterImage="https://scamscan.io/static/logo.svg"
            />

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            <div className="container mx-auto px-4 py-20 md:py-28 relative">

                {/* Header */}
                <div className="mx-auto mb-12 max-w-5xl text-center">
                    <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
                        CONTACT US
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                        Whether you have questions, feedback, partnership proposals, or 
                        need support — our team is here to help.
                    </p>
                </div>

                {/* Contact card */}
                <div className="mx-auto max-w-3xl rounded-2xl border bg-card/60 p-6 md:p-10 shadow-sm backdrop-blur">
                    <div className="space-y-10 text-muted-foreground text-[15px] md:text-base leading-relaxed">

                        {/* General email */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">
                                General Inquiries
                            </h2>
                            <p>If you have questions, suggestions, or need assistance, contact us at:</p>
                            <p className="mt-2">
                                <a
                                    href="mailto:contact@scamscan.io"
                                    className="text-primary underline underline-offset-2"
                                >
                                    contact@scamscan.io
                                </a>
                            </p>
                        </div>

                        {/* Privacy email */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">
                                Privacy Requests
                            </h2>
                            <p>
                                For GDPR requests, data removal, or privacy-related questions, please write to:
                            </p>
                            <p className="mt-2">
                                <a
                                    href="mailto:privacy@scamscan.io"
                                    className="text-primary underline underline-offset-2"
                                >
                                    privacy@scamscan.io
                                </a>
                            </p>
                        </div>

                        {/* Legal email */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">
                                Legal Inquiries
                            </h2>
                            <p>
                                For legal matters, DMCA takedowns, or compliance inquiries, contact our legal team:
                            </p>
                            <p className="mt-2">
                                <a
                                    href="mailto:legal@scamscan.io"
                                    className="text-primary underline underline-offset-2"
                                >
                                    legal@scamscan.io
                                </a>
                            </p>
                        </div>

                        {/* Partnerships */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">
                                Partnerships & Collaboration
                            </h2>
                            <p>
                                If you represent a company, exchange, security team, or data provider 
                                and would like to collaborate, we would be happy to discuss integration 
                                and partnership opportunities.
                            </p>
                        </div>

                        {/* Issue reporting */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-3">
                                Report an Issue
                            </h2>
                            <p>
                                If you found a bug, incorrect information, or have suggestions for improving 
                                the platform — please let us know. Your feedback helps us make ScamScan.io 
                                safer for everyone.
                            </p>
                        </div>

                        {/* Final note */}
                        <div className="pt-6 border-t">
                            <p className="text-sm text-muted-foreground">
                                We appreciate every message. ScamScan.io grows thanks to the support, trust, 
                                and contributions of our community.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

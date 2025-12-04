import { Check } from "lucide-react";
import SeoHead from "../components/Seo"

function CookiePolicy() {
    return (
        <section className="relative">
            <SeoHead
                title="Cookie Policy — ScamScan.io"
                description="Learn how ScamScan.io uses only strictly necessary cookies for authentication and security. No tracking, analytics, or advertising cookies used."
                canonicalUrl="https://scamscan.io/cookies"
                robots="index,follow"
                ogType="website"
                ogImage="https://scamscan.io/static/logo.svg"
                twitterCard="summary_large_image"
                twitterImage="https://scamscan.io/static/logo.svg"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="container mx-auto px-4 py-20 md:py-28 relative">
                <div className="mx-auto mb-12 max-w-6xl">
                    <h1 className="mb-4 text-4xl tracking-tight md:text-5xl">
                        Cookie Policy — ScamScan.io
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Last Updated: 11.28.2025
                    </p>
                </div>

                <div className="mx-auto max-w-6xl rounded-2xl border bg-card/60 p-6 md:p-10 shadow-sm">
                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-muted-foreground">

                        {/* INTRO */}
                        <p>
                            This Cookie Policy explains how ScamScan.io (“we”, “us”, “our”) uses cookies and similar
                            technologies when you visit or interact with our website. This Policy complies with GDPR,
                            CCPA/CPRA, DMA, LGPD, POPIA, and Google Consent Mode requirements.
                        </p>
                        <p>
                            ScamScan.io uses only strictly necessary cookies required for authentication and security.
                            We do not use advertising, tracking, or marketing cookies.
                        </p>

                        {/* 1. What Are Cookies */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files stored on your device by your browser. They may be required
                                for authentication, security, or website performance. ScamScan.io uses only essential
                                cookies that are necessary for account login and platform security.
                            </p>
                        </section>

                        {/* 2. Types of cookies */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground">2. Types of Cookies We Use</h2>

                            {/* 2.1 Strictly Necessary */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.1 Strictly Necessary Cookies (Always Active)
                                </h3>
                                <p>
                                    These cookies are essential for ScamScan.io to function. They do not require consent
                                    under GDPR because the Service cannot operate without them.
                                </p>

                                <ul className="space-y-2">
                                    {/* Authentication cookie */}
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-medium text-foreground">Authentication Cookie
                                                (Refresh Token)</span> – used to keep you logged in securely and refresh
                                            your session. Stored as an HTTP-only, Secure cookie.
                                        </span>
                                    </li>

                                    {/* Security cookie */}
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-medium text-foreground">Cloudflare Security
                                                Cookies</span> – automatically placed to protect against DDoS attacks,
                                            bots, abuse, and malicious traffic.
                                        </span>
                                    </li>

                                    {/* Access token note */}
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>
                                            <span className="font-medium text-foreground">Access Token</span> – used
                                            only in memory (not stored in a cookie) or via secure transport for API
                                            requests.
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* 2.2 Functional Cache */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.2 Functional Cache (Not Cookies)
                                </h3>
                                <p>
                                    ScamScan.io uses TanStack Query for request caching. This cache:
                                </p>

                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>Is stored in memory or local storage.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>Does not track users or collect personal data.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                        <span>Is used only to improve performance and reduce server load.</span>
                                    </li>
                                </ul>

                                <p>
                                    Because this is not a cookie and does not involve tracking, it is exempt from cookie
                                    consent under GDPR.
                                </p>
                            </div>
                        </section>

                        {/* 3. We do NOT use */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">3. Cookies We Do NOT Use</h2>
                            <p>ScamScan.io does <strong className="text-foreground">not</strong> use:</p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>Advertising cookies</li>
                                <li>Tracking or behavioral cookies</li>
                                <li>Marketing cookies</li>
                                <li>Retargeting pixels (Meta, TikTok, Twitter)</li>
                                <li>Google Analytics cookies</li>
                                <li>A/B testing cookies</li>
                                <li>Fingerprinting technologies</li>
                            </ul>

                            <p>
                                We do not sell or share cookie data under CCPA/CPRA definitions.
                            </p>
                        </section>

                        {/* 4. Why no banner */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                4. Why We Do Not Require a Cookie Banner
                            </h2>
                            <p>
                                Cookie banners are required only for non-essential cookies such as analytics or
                                marketing. ScamScan.io uses only strictly necessary cookies for authentication and
                                security. Therefore:
                            </p>

                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>A cookie banner is <strong className="text-foreground">not required</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>Consent is <strong className="text-foreground">not needed</strong> for necessary cookies.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>The website cannot function without these cookies.</span>
                                </li>
                            </ul>
                        </section>

                        {/* 5. Legal basises */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">5. Legal Basis for Cookie Use</h2>
                            <p>
                                Depending on your jurisdiction, we rely on the following legal bases:
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>GDPR Art. 6(1)(b) — Authentication and service operation</li>
                                <li>GDPR Art. 6(1)(f) — Legitimate interest: security and anti-fraud</li>
                                <li>LGPD Art. 7(I), Art. 10 — Legitimate interest</li>
                                <li>POPIA Section 11(1)(d) — Legitimate interest</li>
                                <li>CCPA/CPRA — Service provider purposes only</li>
                                <li>DMA — Strictly necessary cookies exempt from consent</li>
                            </ul>
                        </section>

                        {/* 6. Managing cookies */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">6. Managing Cookies</h2>
                            <p>
                                You can delete or block cookies in your browser settings. However, disabling necessary
                                cookies will prevent you from logging in or using ScamScan.io.
                            </p>
                        </section>

                        {/* 7. consent mode */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                7. Google Consent Mode Compliance
                            </h2>
                            <p>
                                ScamScan.io does not currently use Google Analytics or other Google tracking cookies.
                                If implemented in the future, we will support Consent Mode v2 with proper opt-in and
                                transparency controls.
                            </p>
                        </section>

                        {/* 8. Changes */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
                            <p>
                                We may update this Cookie Policy to reflect legal, technical, or operational changes.
                                The &quot;Last Updated&quot; date will be revised accordingly.
                            </p>
                        </section>

                        {/* 9. Contact */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">9. Contact Information</h2>
                            <p>For questions about this Cookie Policy, please contact us at:</p>
                            <p className="font-medium text-foreground">privacy@scamscan.io</p>
                        </section>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default CookiePolicy;

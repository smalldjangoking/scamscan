import SeoHead from "../components/Seo"

function PrivacyPolicy() {
    return (
        <section className="relative">
            <SeoHead
                title="Privacy Policy | ScamScan.io"
                description="Learn how ScamScan.io collects, uses, and protects your personal information in accordance with GDPR, CCPA, and other global data privacy laws."
                canonicalUrl="https://scamscan.io/privacy"
                robots="index,follow"
                ogType="article"
                ogImage="https://scamscan.io/static/logo.svg"
                twitterCard="summary_large_image"
                twitterImage="https://scamscan.io/static/logo.svg"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="container mx-auto px-4 py-20 md:py-28 relative">
                <div className="mx-auto mb-12 max-w-6xl">
                    <h1 className="mb-4 text-4xl tracking-tight md:text-5xl">
                        Privacy Policy — ScamScan.io
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg">
                        Last Updated: 11.28.2025
                    </p>
                </div>

                <div className="mx-auto max-w-6xl rounded-2xl border bg-card/60 p-6 md:p-10 shadow-sm">
                    <div className="space-y-8 text-sm md:text-base leading-relaxed text-muted-foreground">
                        <p>
                            This Privacy Policy explains how ScamScan.io (“we”, “us”, “our”) collects, uses, stores, and
                            protects personal information when you access or use our website, products, and services.
                            ScamScan.io provides tools for users to create reports about cryptocurrency wallet addresses,
                            websites, and crypto-related projects, including titles, descriptions, screenshots, and other
                            user-generated content. We are committed to protecting your privacy and complying with
                            international data protection laws, including the GDPR, CCPA, PIPEDA, UK Data Protection Act,
                            and other applicable regulations.
                        </p>
                        <p>
                            By accessing or using ScamScan.io, you consent to the practices described in this Privacy
                            Policy.
                        </p>

                        {/* 1. About ScamScan.io */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                1. About ScamScan.io
                            </h2>
                            <p>
                                ScamScan.io is an informational platform that allows users to submit reports (“Reports”)
                                regarding potentially fraudulent cryptocurrency addresses, suspicious websites, investment
                                schemes, and other crypto-related projects. The platform also enables users to create
                                accounts, leave comments, participate in community discussions, and engage with posted
                                content. Our goal is to support transparency in the digital asset ecosystem.
                            </p>
                        </section>

                        {/* 2. Information We Collect */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground">
                                2. Information We Collect
                            </h2>
                            <p>
                                We collect different types of information to provide and improve our services. The
                                categories of personal data we collect include:
                            </p>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.1 Information You Provide Directly
                                </h3>
                                <p>
                                    When you create an account, file a report, leave comments, or interact with
                                    ScamScan.io, we collect the following:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Email address</li>
                                    <li>Username and password</li>
                                    <li>First and last name (if provided)</li>
                                    <li>Titles, descriptions, and details submitted in Reports</li>
                                    <li>Screenshots, images, or files you upload</li>
                                    <li>Comments, replies, and messages posted on our platform</li>
                                    <li>Any additional information you voluntarily provide</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.2 Cookies and Tracking Technologies
                                </h3>
                                <p>
                                    We use cookies and similar technologies to keep you signed in, maintain site
                                    functionality, and improve user experience. Cookies may store:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Session information</li>
                                    <li>Authentication tokens</li>
                                    <li>Your language and interface preferences</li>
                                </ul>
                                <p>
                                    A detailed description of our cookie use will be provided in our Cookie Policy.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.3 Google Analytics and Third-Party Analytics
                                </h3>
                                <p>
                                    We use Google Analytics to understand how users interact with ScamScan.io. Google
                                    Analytics collects:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Page views</li>
                                    <li>Session duration</li>
                                    <li>Referring URLs</li>
                                    <li>Browser and device types (without fingerprinting)</li>
                                    <li>Aggregate usage data</li>
                                </ul>
                                <p>
                                    This data is anonymized where possible and used solely for performance optimization
                                    and service improvement.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.4 Search History
                                </h3>
                                <p>
                                    We store user search history to improve service functionality, provide personalized
                                    results, and enhance fraud investigation features. Search history is linked to your
                                    account but is never shared publicly.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-foreground">
                                    2.5 Information We Do NOT Collect
                                </h3>
                                <p>
                                    We do not store or collect the following categories of data:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Device or browser fingerprinting</li>
                                    <li>Hardware identifiers</li>
                                    <li>
                                        Precise geolocation data beyond city-level information (unless you voluntarily
                                        provide it)
                                    </li>
                                    <li>
                                        Sensitive categories of data such as racial or ethnic origin, political opinions,
                                        religious beliefs, health information, biometrics, or similar categories
                                    </li>
                                </ul>
                                <p>
                                    We also do not permanently log or store IP addresses for tracking, profiling, or
                                    analytics purposes. However, IP addresses may be temporarily processed by our
                                    hosting providers (such as Cloudflare) or by our internal security systems to:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Protect the platform from DDoS attacks</li>
                                    <li>Detect spam, abuse, or unusual activity</li>
                                    <li>Apply temporary rate-limiting or access restrictions</li>
                                    <li>Ensure system stability and security</li>
                                </ul>
                                <p>
                                    Any such processing is strictly technical, short-lived, and never used to identify
                                    users, build profiles, or track behavior across the internet. We do not build device
                                    fingerprints, do not use cross-site tracking, and do not intentionally combine
                                    technical identifiers with personal data.
                                </p>
                            </div>
                        </section>

                        {/* 3. How We Use Personal Data */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                3. How We Use Personal Data
                            </h2>
                            <p>
                                We use your data to operate, maintain, and enhance ScamScan.io. Processing is based on
                                legitimate interests, performance of a contract, or your explicit consent. We process
                                data for the following purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>To create and manage your user account</li>
                                <li>To allow users to file Reports with cryptocurrency-related content</li>
                                <li>
                                    To store and display user-generated content (including titles, descriptions, screenshots,
                                    comments, and any additional report fields or information the user chooses to submit)
                                </li>
                                <li>To improve detection of fraudulent activity in the crypto industry</li>
                                <li>To provide customer support and respond to inquiries</li>
                                <li>To analyze platform performance and user behavior</li>
                                <li>To enforce our Terms of Service and combat abuse</li>
                                <li>To protect platform integrity and user safety</li>
                                <li>To comply with legal or regulatory obligations</li>
                            </ul>
                            <p>
                                User search history may be used to enhance fraud-detection patterns, personalize
                                recommendation features, and improve platform search functionality.
                            </p>
                        </section>

                        {/* 4. Legal Basis */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                4. Legal Basis for Processing (GDPR Compliance)
                            </h2>
                            <p>
                                If you reside in the European Economic Area (EEA), we process your information under one
                                of the following lawful bases:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <span className="font-medium">Contractual necessity:</span> to provide our services
                                    and manage accounts
                                </li>
                                <li>
                                    <span className="font-medium">Legitimate interests:</span> to maintain security,
                                    prevent fraud, and improve platform functionality
                                </li>
                                <li>
                                    <span className="font-medium">Consent:</span> for cookie usage, analytics, and email
                                    communication
                                </li>
                                <li>
                                    <span className="font-medium">Legal obligation:</span> where data is required for
                                    compliance with applicable laws
                                </li>
                            </ul>
                        </section>

                        {/* 5. How We Share Personal Data */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground">
                                5. How We Share Personal Data
                            </h2>
                            <p>
                                We do not sell personal information. We only share data with trusted third parties when
                                necessary:
                            </p>

                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    5.1 Service Providers
                                </h3>
                                <p>
                                    We share limited data with vendors who support our operations, including:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Hosting providers: Vercel, Cloudflare, or equivalent</li>
                                    <li>Analytics tools: Google Analytics</li>
                                    <li>Email delivery services</li>
                                    <li>Database and security infrastructure providers</li>
                                </ul>
                                <p>
                                    These providers process data strictly under contractual agreements and cannot use it
                                    for their own purposes.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    5.2 Publicly Visible Information
                                </h3>
                                <p>
                                    The following data may be publicly visible on ScamScan.io:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Your username</li>
                                    <li>Reports you create</li>
                                    <li>Comments and replies</li>
                                    <li>Uploaded screenshots (unless your report is private)</li>
                                </ul>
                                <p>
                                    We strongly advise not to share sensitive personal details in reports or comments.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-foreground">
                                    5.3 Legal Requests
                                </h3>
                                <p>
                                    We may disclose information if required by law, legal process, or to protect the
                                    rights, safety, or property of ScamScan.io, our users, or the public.
                                </p>
                            </div>
                        </section>

                        {/* 6. International Data Transfers */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                6. International Data Transfers
                            </h2>
                            <p>
                                ScamScan.io operates globally. Your information may be processed outside your country,
                                including in countries without the same level of data protection. Where required, we use:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Standard Contractual Clauses (SCCs)</li>
                                <li>Data Processing Agreements (DPAs)</li>
                                <li>Technical safeguards such as encryption</li>
                            </ul>
                            <p>
                                We comply with GDPR, CCPA, UK GDPR, PIPEDA, and other international standards.
                            </p>
                        </section>

                        {/* 7. Data Retention */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                7. Data Retention
                            </h2>
                            <p>
                                We retain personal data only for as long as necessary:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Account information is stored until your account is deleted</li>
                                <li>
                                    User-generated reports and comments may remain publicly visible unless removed under
                                    moderation rules
                                </li>
                                <li>Search history is retained until cleared by the user</li>
                                <li>
                                    Backup data may remain securely stored for a limited period (typically 30–90 days)
                                </li>
                            </ul>
                            <p>
                                When data is no longer needed, it is securely deleted or anonymized.
                            </p>
                        </section>

                        {/* 8. Security Measures */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                8. Security Measures
                            </h2>
                            <p>
                                We implement industry-standard security practices to protect your data from unauthorized
                                access, alteration, or disclosure. Measures include:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Encrypted connections (HTTPS/TLS 1.2+)</li>
                                <li>Secure password hashing (bcrypt/argon2)</li>
                                <li>Role-based access controls</li>
                                <li>Firewalls and DDoS protection (Cloudflare)</li>
                                <li>Regular security audits</li>
                                <li>Encrypted storage for sensitive fields</li>
                                <li>Automated monitoring for unusual activity</li>
                            </ul>
                            <p>
                                No system is completely secure, but we make reasonable efforts to safeguard your
                                information.
                            </p>
                        </section>

                        {/* 9. Your Rights */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                9. Your Rights
                            </h2>
                            <p>
                                Depending on your region (GDPR, CCPA, PIPEDA, etc.), you may have the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your account and associated data</li>
                                <li>Download/export your data (data portability)</li>
                                <li>Withdraw consent</li>
                                <li>Object to data processing</li>
                                <li>Disable cookies</li>
                                <li>Request information about how your data is used</li>
                            </ul>
                            <p>
                                To exercise your rights, contact us at:{" "}
                                <span className="font-medium text-foreground">privacy@scamscan.io</span>.
                            </p>
                            <p>
                                We may take steps to verify your identity before fulfilling requests.
                            </p>
                        </section>

                        {/* 10. Children and Age Restrictions */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                10. Children and Age Restrictions
                            </h2>
                            <p>
                                ScamScan.io is not intended for individuals under 13 years of age, or the minimum age
                                allowed by local law. We do not knowingly collect information from minors.
                            </p>
                            <p>
                                If you believe a minor has provided data, contact us and we will remove it.
                            </p>
                        </section>

                        {/* 11. User-Generated Content */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                11. User-Generated Content and Privacy
                            </h2>
                            <p>
                                All Reports, comments, screenshots, and other user-generated content you submit may be
                                visible to others. You are solely responsible for removing personal information from
                                such content.
                            </p>
                            <p>
                                We reserve the right to moderate or remove content that violates our Terms of Service.
                            </p>
                        </section>

                        {/* 12. Changes */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                12. Changes to This Privacy Policy
                            </h2>
                            <p>
                                We may update this Privacy Policy periodically. When we do, we will adjust the “Last
                                Updated” date at the top of the document. Significant changes will be communicated
                                through our website.
                            </p>
                        </section>

                        {/* 13. Contact */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-foreground">
                                13. Contact Information
                            </h2>
                            <p>
                                For privacy-related requests, questions, or concerns, contact us at:
                            </p>
                            <span className="font-medium text-foreground">
                                privacy@scamscan.io
                            </span>
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PrivacyPolicy;

/**
 * Cloudflare Worker — SEO Pre-rendering for ScamScan SPA
 *
 * Flow for bots:
 *   1. Fetch the React shell from the origin (index.html)
 *   2. Fetch SEO metadata from the FastAPI backend
 *   3. Inject <title>, meta tags, JSON-LD, and pre-rendered body content
 *      via HTMLRewriter before delivering to the crawler
 *
 * Flow for real users:
 *   - Pass through unchanged (React renders client-side as normal)
 */

const BOT_PATTERN =
    /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|telegrambot|applebot|linkedinbot|slurp|ia_archiver|ahrefsbot|semrushbot|rogerbot|dotbot/i;

const FRONTEND_ORIGIN = "https://scamscan.io";
const SEO_API = "https://api.scamscan.io/v1/ceo/meta";

/**
 * Escapes a value for safe injection into an HTML attribute (content="...").
 * Prevents XSS when meta.title / meta.description contain quotes or angle brackets.
 */
function escapeAttr(value) {
    if (value == null) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const ua = request.headers.get("user-agent") || "";
        const isBot = BOT_PATTERN.test(ua);

        // Avoid infinite loop when the worker re-fetches the origin
        if (request.headers.has("x-proxy-step")) {
            return await fetch(request);
        }

        const newHeaders = new Headers(request.headers);
        newHeaders.set("x-proxy-step", "1");

        const response = await fetch(FRONTEND_ORIGIN + url.pathname + url.search, {
            method: request.method,
            headers: newHeaders,
        });

        // Real users get the unmodified React shell
        if (!isBot) return response;

        try {
            // page= param forwarded for paginated routes like /reports?page=2
            const queryString = url.search ? url.search.replace("?", "&") : "";
            const seoResponse = await fetch(
                `${SEO_API}?path=${encodeURIComponent(url.pathname)}${queryString}`
            );

            if (!seoResponse.ok) return response;

            const meta = await seoResponse.json();
            const e = escapeAttr;

            return new HTMLRewriter()
                // Replace the default <title> from index.html
                .on("title", {
                    element(el) {
                        if (meta.title) el.setInnerContent(e(meta.title));
                    },
                })
                // Inject all meta/OG/Twitter/JSON-LD tags into <head>
                .on("head", {
                    element(el) {
                        if (meta.description)
                            el.append(`<meta name="description" content="${e(meta.description)}">`, { html: true });
                        if (meta.keywords)
                            el.append(`<meta name="keywords" content="${e(meta.keywords)}">`, { html: true });

                        el.append(
                            `<link rel="canonical" href="${e(meta.canonical || FRONTEND_ORIGIN + url.pathname)}">`,
                            { html: true }
                        );
                        el.append(
                            `<meta name="robots" content="${e(meta.robots || "index, follow")}">`,
                            { html: true }
                        );

                        // Open Graph
                        el.append(`<meta property="og:site_name" content="ScamScan">`, { html: true });
                        el.append(`<meta property="og:title" content="${e(meta.title)}">`, { html: true });
                        el.append(`<meta property="og:description" content="${e(meta.description)}">`, { html: true });
                        el.append(`<meta property="og:type" content="${e(meta.og_type || "website")}">`, { html: true });
                        el.append(`<meta property="og:image" content="${e(meta.og_image || FRONTEND_ORIGIN + "/logo.svg")}">`, { html: true });
                        el.append(`<meta property="og:url" content="${e(meta.og_url || meta.canonical || FRONTEND_ORIGIN + url.pathname)}">`, { html: true });

                        // Twitter Card
                        el.append(`<meta name="twitter:card" content="${e(meta.twitter_card || "summary_large_image")}">`, { html: true });
                        el.append(`<meta name="twitter:title" content="${e(meta.title)}">`, { html: true });
                        el.append(`<meta name="twitter:description" content="${e(meta.description)}">`, { html: true });
                        el.append(`<meta name="twitter:image" content="${e(meta.og_image || FRONTEND_ORIGIN + "/logo.svg")}">`, { html: true });

                        // Pagination links — critical for Google to crawl paginated reports
                        if (meta.prev) el.append(`<link rel="prev" href="${e(meta.prev)}">`, { html: true });
                        if (meta.next) el.append(`<link rel="next" href="${e(meta.next)}">`, { html: true });

                        // JSON-LD structured data (ClaimReview, BreadcrumbList, WebSite, etc.)
                        if (meta.schema) {
                            el.append(
                                `<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`,
                                { html: true }
                            );
                        }
                    },
                })
                // Inject pre-rendered page content into #root so Google indexes real text,
                // not an empty div. React replaces this on load for real users.
                .on("#root", {
                    element(el) {
                        if (meta.body_html) {
                            el.setInnerContent(meta.body_html, { html: true });
                        }
                    },
                })
                .transform(response);
        } catch (err) {
            console.error("SEO Worker Error:", err.message);
            return response;
        }
    },
};

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const ua = request.headers.get("user-agent") || "";
        const isBot = /googlebot|bingbot|yandex|duckduckbot|baiduspider|facebookexternalhit|twitterbot|telegrambot/i.test(ua);

        if (request.headers.has("x-proxy-step")) {
            return await fetch(request);
        }

        const newHeaders = new Headers(request.headers);
        newHeaders.set("x-proxy-step", "1");
        
        // В продакшене Cloudflare сам поймет, как достать статику с твоего домена
        const FRONTEND_ORIGIN = "https://scamscan.io";

        const response = await fetch(FRONTEND_ORIGIN + url.pathname + url.search, {
            method: request.method,
            headers: newHeaders
        });

        if (!isBot) return response;

        try {
            const seoResponse = await fetch(`https://api.scamscan.io/v1/ceo/meta?path=${encodeURIComponent(url.pathname)}&query=${encodeURIComponent(url.search)}`);

            if (!seoResponse.ok) return response;
            const meta = await seoResponse.json();

            return new HTMLRewriter()
                // 1. ПРАВИЛЬНО: Заменяем существующий заголовок
                .on("title", {
                    element(el) { if (meta.title) el.setInnerContent(meta.title); }
                })
                .on("head", {
                    element(el) {
                        // Мета-теги
                        if (meta.description) el.append(`<meta name="description" content="${meta.description}">`, { html: true });
                        if (meta.keywords) el.append(`<meta name="keywords" content="${meta.keywords}">`, { html: true });
                        el.append(`<link rel="canonical" href="${meta.canonical || FRONTEND_ORIGIN + url.pathname}">`, { html: true });
                        el.append(`<meta name="robots" content="${meta.robots || 'index, follow'}">`, { html: true });

                        // Open Graph
                        el.append(`<meta property="og:title" content="${meta.title}">`, { html: true });
                        el.append(`<meta property="og:description" content="${meta.description}">`, { html: true });
                        el.append(`<meta property="og:type" content="${meta.og_type || 'website'}">`, { html: true });
                        el.append(`<meta property="og:image" content="${meta.og_image || 'https://scamscan.io/logo.svg'}">`, { html: true });
                        el.append(`<meta property="og:url" content="${meta.canonical || FRONTEND_ORIGIN + url.pathname}">`, { html: true });

                        // Twitter
                        el.append(`<meta name="twitter:card" content="${meta.twitter_card || 'summary_large_image'}">`, { html: true });
                        el.append(`<meta name="twitter:title" content="${meta.title}">`, { html: true });
                        el.append(`<meta name="twitter:description" content="${meta.description}">`, { html: true });
                        el.append(`<meta name="twitter:image" content="${meta.og_image || 'https://scamscan.io/logo.svg'}">`, { html: true });

                        if (meta.schema) {
                            el.append(`<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`, { html: true });
                        }
                    }
                })
                .transform(response);
        } catch (e) {
            console.error("SEO Fetch Error:", e.message);
            return response;
        }
    }
};
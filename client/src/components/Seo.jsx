import { Helmet } from "react-helmet-async";

const SeoHead = ({
  // base
  title,                // <title>
  description,          // meta description
  canonicalUrl,         // canonical
  robots = "index,follow", // "index,follow" | "noindex,nofollow" и т.п.

  // Open Graph (для соцсетей / мессенджеров)
  ogTitle,
  ogDescription,
  ogType = "website",   // "website" | "article" | "profile" | "video.other"
  ogUrl,
  ogImage,
  ogSiteName = "ScamScan.io",
  ogLocale = "en_US",   // "en_US", "uk_UA", "ru_RU", ...

  // Twitter Cards
  twitterCard = "summary_large_image", // "summary" | "summary_large_image" | "app" | "player"
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = "@scamscan",   // @handle
  twitterCreator,              // @handle

  // Доп. мета
  keywords,                    // ["crypto scam", "wallet checker"]
  author,
  themeColor = "#050816",      // #000000
  appName = "ScamScan",        // "ScamScan"

  // Локаль / язык страницы
  lang = "en",

  // JSON-LD схема (если хочешь прокидывать свою)
  jsonLd,                      // объект или массив объектов

  // Включить дефолтную схему WebSite для ScamScan
  enableDefaultWebsiteSchema = true,
}) => {
  const finalTitle = title ? `${title} | ScamScan` : "ScamScan";
  const finalDescription = description || "";

  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || finalDescription;
  const finalOgUrl = ogUrl || canonicalUrl;
  const finalOgImage = ogImage;

  const finalTwitterTitle = twitterTitle || finalTitle;
  const finalTwitterDescription = twitterDescription || finalDescription;
  const finalTwitterImage = twitterImage || finalOgImage;

  // Дефолтная JSON-LD схема сайта
  const defaultWebsiteSchema = enableDefaultWebsiteSchema
    ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ScamScan",
        url: canonicalUrl || "https://scamscan.io",
        description: finalDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: "https://scamscan.io/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }
    : null;

  // Если передал свой jsonLd — комбинируем в массив
  const structuredData = (() => {
    const blocks = [];
    if (defaultWebsiteSchema) blocks.push(defaultWebsiteSchema);
    if (jsonLd) blocks.push(jsonLd);
    if (!blocks.length) return null;
    return blocks.length === 1 ? blocks[0] : blocks;
  })();

  return (
    <Helmet htmlAttributes={{ lang }}>
      {/* Title */}
      <title>{finalTitle}</title>

      {/* Base meta */}
      {finalDescription && (
        <meta name="description" content={finalDescription} />
      )}
      {robots && <meta name="robots" content={robots} />}
      {appName && <meta name="application-name" content={appName} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}
      {author && <meta name="author" content={author} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      {finalOgTitle && <meta property="og:title" content={finalOgTitle} />}
      {finalOgDescription && (
        <meta property="og:description" content={finalOgDescription} />
      )}
      {ogType && <meta property="og:type" content={ogType} />}
      {finalOgUrl && <meta property="og:url" content={finalOgUrl} />}
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}
      {ogSiteName && <meta property="og:site_name" content={ogSiteName} />}
      {ogLocale && <meta property="og:locale" content={ogLocale} />}

      {/* Twitter Cards */}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {finalTwitterTitle && (
        <meta name="twitter:title" content={finalTwitterTitle} />
      )}
      {finalTwitterDescription && (
        <meta name="twitter:description" content={finalTwitterDescription} />
      )}
      {finalTwitterImage && (
        <meta name="twitter:image" content={finalTwitterImage} />
      )}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoHead;

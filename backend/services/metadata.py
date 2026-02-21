from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy import select, func
from database.models import Reports
import logging
import re
from math import ceil


SITE_URL = "https://scamscan.io"
SITE_NAME = "ScamScan"
PAGE_SIZE = 10


def _esc(text: str) -> str:
    """Escape HTML special characters for safe inline injection."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


class MetaData(dict):
    """
    A specialized dictionary for managing SEO metadata and structured data (JSON-LD).

    Designed to be populated by dynamic methods and then consumed by a Cloudflare Worker
    that injects SSR-ready <meta> tags and JSON-LD into the HTML response before delivery.
    """

    def __init__(self, **kwargs) -> None:
        base = {
            "title": f"{SITE_NAME} | Community-driven crypto scam database",
            "description": (
                "Protect the community by reporting fraudulent wallets and suspicious websites. "
                "Search our database to stay safe from crypto scams."
            ),
            "canonical": SITE_URL,
            "og_url": SITE_URL,
            "robots": "index, follow",
            "og_type": "website",
            "og_image": f"{SITE_URL}/logo.svg",
            "twitter_card": "summary_large_image",
            "keywords": "crypto scam, report fraud, scam database, suspicious wallet, scamscan",
        }
        base.update(kwargs)
        super().__init__(base)

    def update(self, mapping=None, **kwargs):
        """
        Override to:
        - Normalize keywords list → comma-separated string.
        - Auto-set og_url to match canonical when canonical is provided.
        """
        data = dict(mapping or {}, **kwargs)
        if isinstance(data.get("keywords"), list):
            data["keywords"] = ", ".join(data["keywords"])
        if "canonical" in data:
            data.setdefault("og_url", data["canonical"])
        super().update(data)

    async def homepage_metadata(self) -> "MetaData":
        """
        Enriches metadata for the home page with WebSite + Organization JSON-LD schemas.
        Adds a SearchAction to enable Google Sitelinks Search Box.
        """
        self["body_html"] = (
            f'<h1>{SITE_NAME} — Community-Driven Crypto Scam Database</h1>'
            f'<p>Search and report fraudulent crypto wallets and scam websites. '
            f'Powered by community reports.</p>'
        )

        self["schema"] = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": f"{SITE_URL}/#website",
                    "url": SITE_URL,
                    "name": SITE_NAME,
                    "description": self["description"],
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": f"{SITE_URL}/scan?query={{search_term_string}}",
                        },
                        "query-input": "required name=search_term_string",
                    },
                },
                {
                    "@type": "Organization",
                    "@id": f"{SITE_URL}/#organization",
                    "name": SITE_NAME,
                    "url": SITE_URL,
                    "logo": {
                        "@type": "ImageObject",
                        "url": f"{SITE_URL}/logo.svg",
                        "width": 512,
                        "height": 512,
                    },
                    "sameAs": [],
                },
            ],
        }
        return self

    async def dynamic_report_metadata(self, db_service: AsyncSession, report_id: int) -> "MetaData":
        """
        Fetches a single report and populates metadata with SEO tags + JSON-LD.

        Produces:
        - Meta tags: title, description, canonical, og_type=article, keywords.
        - JSON-LD: ClaimReview (scam verification) + BreadcrumbList.

        Args:
            db_service: The async SQLAlchemy session.
            report_id: Primary key of the report.
        """
        report = await self._fetch_reports(db_service=db_service, report_id=report_id, page=None)

        if not report or isinstance(report, tuple):
            return self

        address = report.address.crypto_address or report.address.website_url
        clean_desc = self._html_tags_cleaner(report.report_description)
        page_url = f"{SITE_URL}/report/show/{report.id}/{report.slug}"
        snippet = clean_desc[:155].rstrip()

        self.update(
            title=f"Scam Report: {report.report_title} | {SITE_NAME}",
            description=f"Scam report for {address}. {snippet}",
            canonical=page_url,
            og_type="article",
            keywords=f"{address} scam report, {report.report_title}, crypto fraud, scam evidence",
        )

        self["body_html"] = (
            f'<article>'
            f'<h1>{_esc(report.report_title)}</h1>'
            f'<p>Reported entity: <strong>{_esc(address)}</strong></p>'
            f'<p>{_esc(clean_desc[:500])}</p>'
            f'<time datetime="{report.created_at.isoformat()}">'
            f'Published: {report.created_at.strftime("%B %d, %Y")}'
            f'</time>'
            f'</article>'
        )

        self["schema"] = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ClaimReview",
                    "datePublished": report.created_at.isoformat(),
                    "url": page_url,
                    "claimReviewed": f"Scam Report for {address}",
                    "author": {
                        "@type": "Organization",
                        "name": SITE_NAME,
                        "url": SITE_URL,
                    },
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": "1",
                        "bestRating": "5",
                        "alternateName": "SCAM",
                    },
                    "itemReviewed": {
                        "@type": "Thing",
                        "name": address,
                    },
                    "reviewBody": clean_desc,
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": f"{SITE_URL}/",
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Reports",
                            "item": f"{SITE_URL}/reports",
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": report.report_title,
                            "item": page_url,
                        },
                    ],
                },
            ],
        }

        return self

    async def dynamic_list_reports_metadata(self, db_service: AsyncSession, page: int) -> "MetaData":
        """
        Generates paginated metadata and JSON-LD for the reports collection page.

        Features:
        - Correct canonical: /reports for page 1, /reports?page=N for others.
        - next/prev pagination links for crawler navigation.
        - ItemList with absolute positions across all pages.
        - BreadcrumbList with optional Page N item.

        Args:
            db_service: The async SQLAlchemy session.
            page: The current page number (1-based).
        """
        data = await self._fetch_reports(db_service=db_service, report_id=None, page=page)

        if not isinstance(data, tuple):
            return self

        reports, total_pages = data
        canonical = f"{SITE_URL}/reports" if page == 1 else f"{SITE_URL}/reports?page={page}"

        prev_url = None
        if page > 1:
            prev_url = f"{SITE_URL}/reports" if page == 2 else f"{SITE_URL}/reports?page={page - 1}"

        self.update(
            title=f"Crypto Scam Reports — Page {page} of {total_pages} | {SITE_NAME}",
            description=(
                f"Browse community-submitted crypto scam reports on {SITE_NAME}. "
                f"Page {page} of {total_pages}. Find fraudulent wallets and scam websites."
            ),
            canonical=canonical,
            next=f"{SITE_URL}/reports?page={page + 1}" if page < total_pages else None,
            prev=prev_url,
        )

        items_html = "".join(
            f'<li><a href="{SITE_URL}/report/show/{r.id}/{r.slug}">{_esc(r.report_title)}</a></li>'
            for r in reports
        )
        self["body_html"] = (
            f'<h1>Crypto Scam Reports — Page {page} of {total_pages}</h1>'
            f'<ul>{items_html}</ul>'
        )

        breadcrumb_items = [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Reports", "item": f"{SITE_URL}/reports"},
        ]
        if page > 1:
            breadcrumb_items.append(
                {"@type": "ListItem", "position": 3, "name": f"Page {page}"}
            )

        self["schema"] = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ItemList",
                    "name": self["title"],
                    "numberOfItems": len(reports),
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": (page - 1) * PAGE_SIZE + i + 1,
                            "item": {
                                "@type": "CreativeWork",
                                "name": r.report_title,
                                "url": f"{SITE_URL}/report/show/{r.id}/{r.slug}",
                                "datePublished": r.created_at.isoformat(),
                            },
                        }
                        for i, r in enumerate(reports)
                    ],
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": breadcrumb_items,
                },
            ],
        }

        return self

    async def _fetch_reports(
        self,
        db_service: AsyncSession,
        page: int | None,
        report_id: int | None,
    ):
        """
        Internal DB query helper.

        Args:
            db_service: Async SQLAlchemy session.
            page: Page number for paginated list query (mutually exclusive with report_id).
            report_id: Primary key for single-report query.

        Returns:
            Single Reports ORM object, tuple(list[Reports], total_pages), or None on failure.
        """
        try:
            query = select(Reports).options(joinedload(Reports.address))

            if report_id:
                result = await db_service.execute(query.where(Reports.id == report_id))
                return result.scalar_one_or_none()

            if page:
                count_res = await db_service.execute(
                    select(func.count()).select_from(query.subquery())
                )
                total_count = count_res.scalar() or 0
                total_pages = ceil(total_count / PAGE_SIZE) if total_count else 1

                query = (
                    query.order_by(Reports.id.desc())
                    .offset((page - 1) * PAGE_SIZE)
                    .limit(PAGE_SIZE)
                )
                result = await db_service.execute(query)
                return result.scalars().all(), total_pages

            return None
        except Exception as e:
            logging.error(f"SEO metadata DB error: {e}")
            return ([], 1) if page else None

    def _html_tags_cleaner(self, html: str) -> str:
        """Strips HTML markup, returning clean plain text for meta descriptions."""
        return re.sub(r"<[^>]*>", "", html)

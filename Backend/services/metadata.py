from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy import select, func
from database.models import Reports
import logging
import re
from math import ceil


class MetaData(dict):
    """
    A specialized dictionary for managing SEO metadata and structured data (JSON-LD).

    This class serves as a central hub for generating titles, descriptions,
    and Schema.org objects. It is designed to be populated by dynamic methods
    and then consumed by edge handlers (like Cloudflare Workers) to inject
    SSR-ready content into the HTML response.
    """

    def __init__(self, **kwargs) -> None:
        base = {
            "title": "ScamScan | Community-driven crypto scam database",
            "description": "Protect the community by reporting fraudulent wallets and suspicious websites. Search our database to stay safe.",
            "canonical": "https://scamscan.io",
            "robots": "index, follow",
            "og_type": "website",
            "og_image": "https://scamscan.io/logo.svg",
            "twitter_card": "summary_large_image",
            "keywords": "crypto scam, report fraud, scam database, suspicious wallet, scamscan",
        }
        base.update(kwargs)
        super().__init__(base)

    async def dynamic_report_metadata(self, db_service: AsyncSession, report_id: int):
        """
        Fetches a single report from the database and populates the metadata object
        with SEO-specific tags and structured JSON-LD schemas.

        This method updates the instance with:
        - Meta tags: title, description.
        - JSON-LD: ClaimReview (for scam verification) and BreadcrumbList.

        Args:
            db_service (AsyncSession): The asynchronous database session.
            report_id (str): The unique identifier (UUID/ID) of the report.

        Returns:
            MetaData: The updated instance of self for method chaining.

        Raises:
            SQLAlchemyError: If there's an issue with the database query.
            AttributeError: If the report exists but has missing related address data.
        """

        print(type(report_id), 'тип такой')
        report = await self._fetch_reports(
            db_service=db_service, report_id=report_id, page=None
        )

        if not report or isinstance(report, tuple):
            return self

        address = report.address.crypto_address or report.address.website_url
        clean_desc = self._html_tags_cleaner(report.report_description)

        self.update(
            {
                "title": f"Report: {report.report_title} | scamscan.io",
                "description": f"Reported Address: {address}, Description: {clean_desc[:100]}",
            }
        )

        self["schema"] = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ClaimReview",
                    "datePublished": report.created_at.isoformat(),
                    "url": f"https://scamscan.io/report/show/{report.id}/{report.slug}",
                    "claimReviewed": f"Scam Report for {address}",
                    "author": {"@type": "Person", "name": "Community"},
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
                            "item": "https://scamscan.io/",
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Reports",
                            "item": "https://scamscan.io/reports",
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": report.report_title,
                        },
                    ],
                },
            ],
        }

        return self

    async def dynamic_list_reports_metadata(self, db_service: AsyncSession, page: int):
        """
        Generates paginated metadata and structured data for the reports collection.

        This method retrieves a slice of reports for the specified page, updates
        standard SEO tags (title, description), and constructs complex JSON-LD
        graphs for search engines.

        Features:
        - Pagination: Calculates 'next' and 'prev' links for crawler navigation.
        - ItemList: Provides a machine-readable list of all reports on the current page.
        - Breadcrumbs: Builds a path from Home > Reports > Page X.

        Args:
            db_service (AsyncSession): The asynchronous database session.
            page (int): The current page number to fetch and display.

        Returns:
            MetaData: The updated instance containing the paginated SEO context.

        Note:
            If the requested page exceeds the total number of pages, it returns
            the base metadata to avoid 404-like content for crawlers.
        """

        data = await self._fetch_reports(
            db_service=db_service, report_id=None, page=page
        )

        if not isinstance(data, tuple):
            return self
        reports, total_pages = data

        self.update(
            {
                "title": f"Explore all scam reports. Page: {page} | Scamscan.io",
                "description": f"Browse scams. Page {page} of {total_pages}.",
                "next": f"/reports?page={page + 1}" if page < total_pages else None,
                "prev": f"/reports?page={page - 1}" if page > 1 else None,
            }
        )

        self["schema"] = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ItemList",
                    "name": self["title"],
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": i + 1,
                            "item": {
                                "@type": "CreativeWork",
                                "name": r.report_title,
                                "url": f"https://scamscan.io/report/show/{r.id}/{r.slug}",
                                "datePublished": r.created_at.isoformat(),
                            },
                        }
                        for i, r in enumerate(reports)
                    ],
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://scamscan.io/",
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Reports",
                            "item": "https://scamscan.io/reports",
                        },
                    ],
                },
            ],
        }
        if page > 1:
            self["schema"]["@graph"][1]["itemListElement"].append(
                {"@type": "ListItem", "position": 3, "name": f"Page {page}"}
            )
        return self

    async def _fetch_reports(
        self, db_service: AsyncSession, page: int | None, report_id: int | None
    ):
        """
        Database session to get Report(s).

        Accepts:
            db_service: Session  (async)
            page (int): Pagination of Reports
            report_id (str): Easy search for specific report in DB

        returns:
            

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
                page_size = 10
                total_pages = ceil(total_count / page_size) if total_count else 1

                query = (
                    query.order_by(Reports.id.desc())
                    .offset((page - 1) * page_size)
                    .limit(page_size)
                )
                result = await db_service.execute(query)
                return result.scalars().all(), total_pages

            return None  # Fallback
        except Exception as e:
            logging.error(f"SEO DB Error: {e}")
            return ([], 1) if page else None

    def _html_tags_cleaner(
        self,
        html: str,
    ) -> str:
        """
        Accepts html (str), Deletes html tags <>

        Returns: Returns clean (str) without HTML Markup
        """

        return re.sub(r"<[^>]*>", "", html)

from fastapi import APIRouter, Query, status
from services.metadata import MetaData
from database.database_settings import SessionDep


router = APIRouter(prefix="/v1/ceo", tags=["bot ceo"], include_in_schema=False)


@router.get(
    "/meta",
    summary="Get SEO Metadata",
    description=(
        "Returns a structured JSON with meta tags (title, description, canonical, JSON-LD) "
        "optimized for search engine bots and social media crawlers. "
        "Supports dynamic paths for addresses and websites."
    ),
    response_description="JSON object containing metadata strings and optional JSON-LD schema",
    status_code=status.HTTP_200_OK,
)
async def seo_bot_prerender_meta(
    session: SessionDep,
    path: str = Query(description="ScamScan URL path for prerender data of the page"),
    page: str = Query(default="1", description="Page number for paginated routes"),
):
    """
    Bot Prerendering metadata resolver.

    - Matches structural URL patterns (scan, report, address, reports)
    - Fetches dynamic data from DB when needed
    - Returns structured SEO payload consumed by Cloudflare Worker for HTML injection
    """

    path_segments = path.strip("/").split("/")

    metadata = MetaData()

    match path_segments:
        # Home page
        case [""]:
            await metadata.homepage_metadata()

        # Scan search page
        case ["scan"]:
            metadata.update(
                title="Scan Crypto Addresses & Websites for Scams | ScamScan",
                description=(
                    "Instantly scan crypto wallet addresses and suspicious websites "
                    "on ScamScan.io to see if the community has reported them as scams or high-risk."
                ),
                canonical="https://scamscan.io/scan",
                keywords="scan crypto address, check wallet scam, website scam checker, crypto fraud scanner",
            )

        # Profile — private, no indexing
        case ["profile"]:
            metadata.update(robots="noindex, nofollow")

        # Scan results for a specific address or website
        case ["scan", entity_type, address]:
            label = "website" if entity_type == "website" else "crypto wallet"
            metadata.update(
                title=f"Is {address} a Scam? | {entity_type.capitalize()} Check | ScamScan",
                description=(
                    f"Check if {address} is a scam. View community reports, fraud signals, "
                    f"and reputation data for this {label} on ScamScan."
                ),
                canonical=f"https://scamscan.io/scan/{entity_type}/{address}",
                keywords=f"{address} scam, {entity_type} fraud check, {address} reports, is {address} safe",
                robots="index, follow",
            )

        # Report submission page
        case ["report"]:
            metadata.update(
                title="Submit a Cryptocurrency Scam Report | ScamScan",
                description=(
                    "Report a fraudulent cryptocurrency wallet or suspicious website "
                    "anonymously or as a registered user. Help the community stay safe."
                ),
                canonical="https://scamscan.io/report",
                keywords=[
                    "submit crypto scam report",
                    "report suspicious wallet",
                    "fraud report form",
                    "report scam website",
                    "crypto scam submission",
                ],
            )

        # Single report detail view
        case ["report", "show", id, _]:
            await metadata.dynamic_report_metadata(
                db_service=session,
                report_id=int(id),
            )

        # Paginated reports list
        case ["reports"]:
            await metadata.dynamic_list_reports_metadata(
                db_service=session,
                page=int(page),
            )

    return metadata

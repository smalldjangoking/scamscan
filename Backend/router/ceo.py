from fastapi import APIRouter, Query, status
from services.metadata import MetaData
from database_settings import SessionDep
from urllib.parse import parse_qs


router = APIRouter(prefix="/v1/ceo", tags=["bot ceo"], include_in_schema=False)


@router.get(
    "/meta",
    summary="Get SEO Metadata",
    description=(
        "Returns a structured JSON with meta tags (title, description, h1) "
        "optimized for search engine bots and social media crawlers. "
        "Supports dynamic paths for addresses and websites."
    ),
    response_description="JSON object containing metadata strings",
    status_code=status.HTTP_200_OK,
)
async def seo_bot_prerender_meta(
    session: SessionDep,
    path: str = Query(description="scamscan url path for prerender data of the page"),
    page: str = Query(default="1", description="Page for pagination"),
):
    """
    Detailed logic for Bot Prerendering

    - Matches structural patterns (scan, report, address)
    - Fetches dynamic data if needed
    """

    path_segments = path.strip("/").split("/")
    
    metadata = MetaData()

    match path_segments:
        # Main page
        case [""]:
            return metadata
        # Main Scan search page
        case ["scan"]:
            metadata.update(
                title="Scan crypto addresses and websites",
                description=(
                    "Instantly scan crypto wallet addresses and suspicious websites "
                    "on ScamScan.io to see if the community has reported them as scams or high-risk."
                ),
            )
        # Profile
        case ["profile"]:
            metadata.update(robots="noindex, nofollow")
        # scan page for founded address
        case ["scan", entity_type, address]:
            metadata.update(
                title=f"Scam reports for {address} | {entity_type} scam scanner",
                description=(
                    f"Investigate {address} for scam reports, fraud detection, and reputation signals. See what the community says about this domain."
                ),
            )
        # Report Submission page
        case ["report"]:
            metadata.update(
                title="Submit a Cryptocurrency Scam Report | ScamScan",
                description="Report a fraudulent cryptocurrency wallet or suspicious website anonymously or as a registered user. Help the community stay safe.",
                keywords=[
                    "submit crypto scam report",
                    "report suspicious wallet",
                    "fraud report form",
                    "report scam website",
                    "crypto scam submission",
                ],
            )
        # Singel Report Detail view
        case ["report", "show", id, _]:
            await metadata.dynamic_report_metadata(
                db_service=session,
                report_id=int(id),
            )
        # Reports page with pagination
        case ["reports"]:
            await metadata.dynamic_list_reports_metadata(
                db_service=session,
                page=int(page),
            )

    return metadata

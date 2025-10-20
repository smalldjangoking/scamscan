from math import ceil

from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import select, func
from starlette import status
from database_settings import SessionDep
from models import Addresses, Reports
from schemas import SubjectEnum

router = APIRouter(prefix="/api/scan", tags=["scan"])


@router.get('/address', status_code=status.HTTP_200_OK)
async def router_check(session: SessionDep,
                       v: str = Query(alias="value", description="Check value for affiliation", max_length=150,
                                      min_length=5),

                       s: SubjectEnum = Query(alias="subject", description="[crypto, website] are allowed."),
                       page: int = Query(
                           default=1,
                           ge=1,
                           description="Current page number for pagination"
                       ),
                       page_size: int = Query(
                           default=10,
                           ge=1,
                           description="Number of reports per page"
                       )
                       ):
    """Routes input to different paths"""

    if s == SubjectEnum.crypto:
        address_query = select(Addresses).where(
            Addresses.subject == s,
            Addresses.crypto_address == v
        )
    else:
        address_query = select(Addresses).where(
            Addresses.subject == s,
            Addresses.website_url == v
        )

    address_result = await session.execute(address_query)
    address = address_result.scalar_one_or_none()

    if not address:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    reports_query = select(Reports).where(Reports.address_id == address.id)

    count_query = select(func.count()).select_from(reports_query.subquery())
    total_count = (await session.execute(count_query)).scalar() or 0
    total_pages = ceil(total_count / page_size) if total_count else 1

    query = reports_query.offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(query)
    reports = result.scalars().all()

    return {
        "address": address,
        "reports": reports,
        'total_reports': total_count,
        "total_pages": total_pages,
    }

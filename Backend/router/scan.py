from math import ceil

from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import select, func
from starlette import status
from database_settings import SessionDep
from models import Addresses, Reports
from schemas import SubjectEnum, AddressAPISchema
from schemas import AddressListReportSchema, AddressReportSchema

router = APIRouter(prefix="/api/scan", tags=["scan"])


@router.get('/address', status_code=status.HTTP_200_OK)
async def get_address(session: SessionDep,
                      v: str = Query(alias="value", description="Address value to search in Addresses", max_length=150,
                                     min_length=5),
                      s: SubjectEnum = Query(alias="subject", description="[crypto, website] are allowed.")
                      ):
    """Finds Address by Input, checks by subject"""

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")

    return {"address": AddressAPISchema.model_validate(address)}


@router.get('/address/reports', status_code=status.HTTP_200_OK)
async def get_reports(session: SessionDep,
                      address_id: int = Query(alias="address_id", description="Address_id is required"),
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
    """Returns Reports filtering by address_id"""

    base_query = select(Reports).where(Reports.address_id == address_id)

    count_query = select(func.count()).select_from(base_query.subquery())
    total_count = (await session.execute(count_query)).scalar_one()

    paged_query = base_query.order_by(Reports.id.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(paged_query)
    reports = result.scalars().all()

    total_pages = ceil(total_count / page_size) if total_count else 1

    return AddressListReportSchema(
        reports=[AddressReportSchema.model_validate(report) for report in reports],
        totalPages=total_pages
    )

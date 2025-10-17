from fastapi import APIRouter, HTTPException, Query, status, Depends, Request, Response
from sqlalchemy.orm import selectinload

from database_settings import SessionDep
from schemas import ReportSchema, ReportsListAPISchema, ReportAPISchema
from sqlalchemy import select, func, or_
from models import Reports, Addresses
from services import validation_jwt_or_401
from fastapi.security import OAuth2PasswordBearer
import bleach
from math import ceil
from slugify import slugify

router = APIRouter(prefix="/api/reports", tags=["reports"])
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


@router.post("/create", status_code=status.HTTP_200_OK)
async def create_report(schema: ReportSchema, session: SessionDep,
                        request: Request, response: Response,
                        token: str | None = Depends(oauth2_scheme_optional)):
    """Create a new report in the database."""
    user_id = None

    if token:
        user_id = await validation_jwt_or_401(request, response, token)

    try:
        address_data = {
            "website_url": schema.website_url,
            "crypto_address": schema.crypto_address,
            "crypto_name": schema.crypto_name,
            "crypto_logo_url": schema.crypto_logo_url,
            "subject": schema.subject,
        }
        slug = slugify(schema.report_title)
        report_data = schema.model_dump(exclude=set(address_data.keys()))
        address = Addresses(**address_data)
        session.add(address)
        await session.commit()

        report = Reports(**report_data, address_id=address.id, slug=slug)
        report.report_description = bleach.clean(report.report_description, tags=["b", "i", "p"], strip=True)


        if user_id:
            report.user_id = int(user_id)

        session.add(report)
        await session.commit()

        return {"message": "Report created successfully", "report_id": report.id}

    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_reports(session: SessionDep, request: Request, response: Response,
                          token: str | None = Depends(oauth2_scheme_optional),
                          q: str = Query(
                              default=None,
                              alias="search",
                              min_length=1,
                              max_length=150,
                              description="Search value for filtering results. Crypto address, website or title are accepted"
                          ),
                          page: int = Query(
                              default=1,
                              ge=1,
                              description="Current page number for pagination"
                          ),
                          page_size: int = Query(
                              default=10,
                              ge=1,
                              description="Number of reports per page"
                          ),
                          category: str = Query(
                              default=None,
                              description="Category of the report"
                          ),
                          orderby: str = Query(
                              default='newest',
                              description="Sort order of the reports"
                          )
                          ):
    """Retrieve all reports by user or all from the database with optional queries and pagination"""
    user_id = None
    if token: user_id = await validation_jwt_or_401(request, response, token)

    query = select(Reports).options(selectinload(Reports.address))

    if category:
        query = query.where(Reports.subject == category)
    if user_id:
        query = query.where(Reports.user_id == user_id)
    if q:
        query = query.where(
            or_(
                Reports.report_title.ilike(f"{q}%"),
                Addresses.crypto_address.ilike(f"%{q}%"),
                Addresses.website_url.ilike(f"%{q}%")
            )
        )
    if orderby:
        if orderby == "newest":  # default
            query = query.order_by(Reports.id.desc())
        if orderby == "oldest":
            query = query.order_by(Reports.id)

    count_query = select(func.count()).select_from(query.subquery())
    total_count = (await session.execute(count_query)).scalar()
    total_pages = ceil(total_count / page_size) if total_count else 1

    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await session.execute(query)
    reports = result.scalars().all()

    return ReportsListAPISchema(
        reports=[ReportAPISchema.model_validate(report) for report in reports],
        totalPages=total_pages
    )

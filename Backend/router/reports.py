from fastapi import APIRouter, HTTPException, Query, status, Depends, Request, Response, Path
from sqlalchemy.orm import selectinload, joinedload

from database_settings import SessionDep
from schemas import ReportSchema, ReportsListAPISchema, ReportAPISchema, \
    SingleReportSchema, AddressAPISchema, SingleReport, PublicUserAPISchema, CommentsSchema, CommentSchema
from sqlalchemy import select, func, or_
from models import Reports, Addresses, Comments
from fastapi.security import OAuth2PasswordBearer
import bleach
from math import ceil
from slugify import slugify

router = APIRouter(prefix="/api/reports", tags=["reports"])
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post("/create", status_code=status.HTTP_200_OK)
async def create_report(schema: ReportSchema,
                        session: SessionDep,
                        token: str | None = Depends(oauth2_scheme_optional)):
    """Create a new report in the database."""
    user_id = None

    if token:
        user_id = await access_token_valid(request, response, token)

    try:
        response = await session.execute(
            select(Addresses).where(
                or_(
                    Addresses.crypto_address == schema.crypto_address,
                    Addresses.website_url == schema.website_url,
                )
            )
        )

        address = response.scalar_one_or_none()


        address_data = {
            "website_url": schema.website_url,
            "crypto_address": schema.crypto_address,
            "crypto_name": schema.crypto_name,
            "crypto_logo_url": schema.crypto_logo_url,
            "subject": schema.subject,
        }

        slug = slugify(schema.report_title)
        report_data = schema.model_dump(exclude=set(address_data.keys()))

        if not address:
            address = Addresses(**address_data)
            session.add(address)
            await session.flush()

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
        query = query.where(Addresses.subject == category)
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


@router.get("/id/{report_id}", status_code=status.HTTP_200_OK)
async def get_report(session: SessionDep,
                     report_id: int = Path(ge=1, description="ID of the report to fetch")):
    """Retrieves single report by id"""

    query = (
        select(Reports)
        .options(joinedload(Reports.address), joinedload(Reports.user))
        .where(Reports.id == report_id)
    )
    result = await session.execute(query)
    report_data = result.scalar_one_or_none()

    if not report_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    return SingleReportSchema(
        address=AddressAPISchema.model_validate(report_data.address),
        report=SingleReport.model_validate(report_data),
        user=(
            PublicUserAPISchema.model_validate(report_data.user)
            if report_data.user is not None
            else None
        ),
    )

@router.get('/{report_id}/comments', status_code=status.HTTP_200_OK)
async def get_report_comments(session: SessionDep,
                              report_id: int,
                              page: int = Query(ge=0, description="Page number for pagination"),
                              page_size: int = Query(
                                  default=10,
                                  ge=1,
                                  description="Number of reports per page"
                              )
                              ):
    """Returns Comments by report_id"""

    query = select(Comments).where(Comments.report_id == report_id)
    count_query = select(func.count()).select_from(query.subquery())

    total_count = (await session.execute(count_query)).scalar_one()

    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await session.execute(query)
    comments = result.scalars().all()
    total_pages = ceil(total_count / page_size) if total_count else 1

    return CommentsSchema(
        comments=[CommentSchema.model_validate(comment) for comment in comments],
        comments_total=total_count,
        total_pages=total_pages
    )


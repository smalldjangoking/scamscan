from fastapi import APIRouter, HTTPException, Query, status, Depends, Request, Response
from database_settings import SessionDep
from schemas import ReportSchema
from sqlalchemy import select, func, or_
from models import ReportModel
from services import validationJWT_or_401
from fastapi.security import OAuth2PasswordBearer
import bleach
from math import ceil

router = APIRouter(prefix="/api/reports", tags=["reports"])
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


@router.post("/create", status_code=status.HTTP_200_OK)
async def create_report(schema: ReportSchema, session: SessionDep,
                        request: Request, response: Response,
                        token: str | None = Depends(oauth2_scheme_optional)):
    """Create a new report in the database."""
    user_id = None

    if token:
        user_id = await validationJWT_or_401(request, response, token)

    try:
        db_report = ReportModel(**schema.model_dump())
        db_report.report_description = bleach.clean(db_report.report_description, tags=["b", "i", "p"], strip=True)

        if user_id:
            db_report.user_id = int(user_id)

        session.add(db_report)
        await session.commit()

        return {"message": "Report created successfully", "report_id": db_report.id}

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
                              max_length=100,
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
    if token: user_id = await validationJWT_or_401(request, response, token)

    query = select(ReportModel)

    if category:
        query = query.where(ReportModel.report_subject == category)
    if user_id:
        query = query.where(ReportModel.user_id == user_id)
    if q:
        query = query.where(
            or_(
                ReportModel.report_title.ilike(f"{q}%"),
                ReportModel.crypto_address.ilike(f"%{q}%"),
                ReportModel.website_url.ilike(f"%{q}%")
            )
        )
    if orderby:
        if orderby == "newest":  # default
            query = query.order_by(ReportModel.id.desc())
        if orderby == "oldest":
            query = query.order_by(ReportModel.id)

    count_query = select(func.count()).select_from(query.subquery())
    total_count = (await session.execute(count_query)).scalar()
    total_pages = ceil(total_count / page_size) if total_count else 1

    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await session.execute(query)
    reports = result.scalars().all()
    return {"reports": reports, "totalPages": total_pages}

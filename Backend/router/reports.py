from fastapi import APIRouter, HTTPException
from database_settings import SessionDep
from schemas import ReportSchema



router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/create")
def create_report(schema: ReportSchema, db: SessionDep):
    return {"message": "Report created successfully", "data": schema.model_dump()}
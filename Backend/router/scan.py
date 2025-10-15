from fastapi import APIRouter, Query, HTTPException
from starlette import status
from database_settings import SessionDep

router = APIRouter(prefix="/api/scan", tags=["scan"])


@router.get('/get/', status_code=status.HTTP_200_OK)
async def info(
        session: SessionDep,
        q: str = Query(
            alias='search',
            min_length=5,
            max_length=150,
            description="Search query value",
        )
):
    ...

from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from database_settings import SessionDep
from services import validationJWT_or_401


router = APIRouter(prefix="/user", tags=["user"])

@router.post("/me")
async def read_user_me(session: SessionDep, user_id: str = Depends(validationJWT_or_401)):

    return {"user": user_id}     
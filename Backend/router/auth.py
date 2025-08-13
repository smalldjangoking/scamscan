import logging
from fastapi import APIRouter, status, HTTPException
from database_settings import SessionDep
from schemas import UserSchema
from services import email_check, add_user, nickname_check

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/create', status_code=status.HTTP_204_NO_CONTENT)
async def user_create(userbase: UserSchema, session: SessionDep):
    if await email_check(userbase.email, session):
        raise HTTPException(status_code=400, detail="Email is already taken")

    if await nickname_check(userbase.nickname, session):
        raise HTTPException(status_code=400, detail="Nickname is already taken")

    try:
        await add_user(userbase, session)
        return  # status 204

    except Exception as error:
        logging.exception(error)
        raise HTTPException(status_code=500, detail="Server is dead at the moment")

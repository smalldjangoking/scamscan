from fastapi import APIRouter
from database import DBSession
from schemas import UserBase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/create')
async def user_create(userbase: UserBase, session: DBSession):

    return userbase
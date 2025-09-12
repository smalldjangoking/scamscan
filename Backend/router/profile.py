from hmac import new
from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from database_settings import SessionDep
from services import validationJWT_or_401
from models import UserModel
from services import verify_password, hash_password
from schemas import ChagnePasswordSchema


router = APIRouter(prefix="/user", tags=["user"])

@router.post("/me")
async def read_user_me(session: SessionDep, user_id: str = Depends(validationJWT_or_401)):
    data = await session.get(UserModel, user_id)

    if data:
        return {
        'email': data.email,
        'name': data.name,
        'surname': data.surname,
        'nickname': data.nickname,
        'phone': data.phone,
        'created_at': data.created_at
        }
    
    raise HTTPException(status_code=401, detail="Bad credentials")


@router.post('/change-password')
async def change_password(passwordSchema: ChagnePasswordSchema, session: SessionDep, user_id: str = Depends(validationJWT_or_401)):
    data = await session.get(UserModel, user_id)

    if verify_password(passwordSchema.old_password, data.hashed_password):
        data.hashed_password = hash_password(passwordSchema.new_password)
        await session.commit()
        return {'message': 'Password changed successfully'}

    else:
        return {'message': 'Old password is incorrect'}

    raise HTTPException(status_code=400, detail="Bad request")

    

@router.post('update-user-info')
async def update_user_info(passwordSchema: ChagnePasswordSchema, session: SessionDep, user_id: str = Depends(validationJWT_or_401)):
    pass
from ast import Try
from hmac import new
from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from database_settings import SessionDep
from services import validationJWT_or_401
from models import UserModel
from services import verify_password, hash_password
from schemas import ChagnePasswordSchema
from schemas import UpdateUserInfoSchema
from sqlalchemy import select


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

    

@router.patch('/update-user-info')
async def update_user_info(userInfoSchema: UpdateUserInfoSchema, session: SessionDep, user_id: str = Depends(validationJWT_or_401)):
    data = await session.get(UserModel, user_id)

    if userInfoSchema.phone:
        result = await session.execute(select(UserModel).where(UserModel.phone == userInfoSchema.phone))
        phone_user = result.scalar_one_or_none()

        if phone_user:
            raise HTTPException(status_code=400, detail="Phone is already in use")

    if userInfoSchema.nickname:
        result = await session.execute(select(UserModel).where(UserModel.nickname == userInfoSchema.nickname))
        nickname_user = result.scalar_one_or_none()

        if nickname_user:
            raise HTTPException(status_code=400, detail="Nickname is already in use")

    try:
        for key, value in userInfoSchema.model_dump(exclude_unset=True).items():
            setattr(data, key, value)
            
            await session.commit()
            return {'status': 'ok', 'field': key}

    except Exception as e:
        return {'status': 'error'}

    raise HTTPException(status_code=400, detail="Bad request")
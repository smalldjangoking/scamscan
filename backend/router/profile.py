from fastapi import APIRouter
from fastapi import Depends, HTTPException
from database.database_settings import SessionDep
from database.models import Users
from router.auth import access_token_valid
from services import verify_password, hash_password
from schemas import ChangePasswordSchema
from schemas import UpdateUserInfoSchema
from sqlalchemy import select


router = APIRouter(prefix="/v1/user", tags=["user"], include_in_schema=False)


@router.post("/me")
async def read_user_me(session: SessionDep, user_id: int = Depends(access_token_valid)):
    data = await session.get(Users, user_id)

    if data:
        return {
            "email": data.email,
            "name": data.name,
            "surname": data.surname,
            "nickname": data.nickname,
            "phone": data.phone,
            "created_at": data.created_at,
        }

    raise HTTPException(status_code=401, detail="Bad credentials")


@router.post("/update/password")
async def change_password(
    passwordSchema: ChangePasswordSchema,
    session: SessionDep,
    user_id: int = Depends(access_token_valid),
):
    user = await session.get(Users, user_id)

    if not user:
        return {"status": "bad", "detail": "User is not found."}

    user.hashed_password = hash_password(passwordSchema.new_password)

    await session.commit()

    return {"message": "Password changed successfully"}


@router.patch("/update/info")
async def update_user_info(
    userInfoSchema: UpdateUserInfoSchema,
    session: SessionDep,
    user_id: int = Depends(access_token_valid),
):

    data = await session.get(Users, user_id)

    if userInfoSchema.nickname:
        result = await session.execute(
            select(Users).where(Users.nickname == userInfoSchema.nickname)
        )
        nickname_user = result.scalar_one_or_none()

        if nickname_user:
            raise HTTPException(status_code=400, detail="Nickname is already in use")

    try:
        for key, value in userInfoSchema.model_dump(exclude_unset=True).items():
            setattr(data, key, value)

        await session.commit()
        return {"status": "ok", "message": "User information was updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail="Bad request")


@router.delete("/delete/me")
async def delete_user(session: SessionDep, user_id: int = Depends(access_token_valid)):
    """Deletes user and all his data"""

    user = await session.get(Users, user_id)

    await session.delete(user)
    await session.commit()

    return {"status": "ok", "detail": "User and all his data were deleted"}

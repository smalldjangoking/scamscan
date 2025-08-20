import logging
import os
import jwt

from fastapi import APIRouter, status, HTTPException
from database_settings import SessionDep
from schemas import UserRegistrationSchema, UserLoginSchema, RefreshTokenSchema
from services import add_user, nickname_check, get_user_by_email, verify_password, create_refresh_token, \
    create_access_token, ALGORITHM


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/create', status_code=status.HTTP_201_CREATED)
async def user_create(userbase: UserRegistrationSchema, session: SessionDep):
    """Registration endpoint."""
    if userbase.password != userbase.password_confirmation:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if await get_user_by_email(userbase.email, session):
        raise HTTPException(status_code=400, detail="Email is already taken")

    if await nickname_check(userbase.nickname, session):
        raise HTTPException(status_code=400, detail="Nickname is already taken")

    try:
        await add_user(userbase, session)
        return {'status': 201, 'message': 'User created'}

    except Exception as error:
        logging.exception(error)
        raise HTTPException(status_code=500, detail="Server is dead at the moment")


@router.post('/login')
async def user_login(userbase: UserLoginSchema, session: SessionDep):
    """Login endpoint.
    format: email, password
    """

    user = await get_user_by_email(userbase.email, session)

    if user is None:
        raise HTTPException(status_code=400, detail="Incorrect credentials.")

    if not verify_password(userbase.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect credentials.")

    refresh_token = create_refresh_token({"sub": str(user.id)})
    access_token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
async def refresh_token_endpoint(refresh_token: RefreshTokenSchema):
    try:
        payload = jwt.decode(refresh_token.refresh_token, os.getenv('SECRET_KEY'), algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token 3")

    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token 2")

    new_access_token = create_access_token({"sub": user_id})

    return {"access_token": new_access_token, "token_type": "bearer"}

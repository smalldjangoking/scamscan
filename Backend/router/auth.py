import os
import jwt
import asyncio
from fastapi import APIRouter, status, HTTPException, Security, Request, Response, Path
from database_settings import SessionDep
from schemas import UserRegistrationSchema, UserLoginSchema, PasswordRestore, EmailRequest
from services import add_user, nickname_check, get_user_by_email, verify_password, access_token_valid, create_refresh_token, \
    create_access_token, ALGORITHM, create_token_verify, hash_password
from fastapi.security import OAuth2PasswordBearer
from smtp.smtp import send_confirm_email, send_reset_password
from models import Email_tokens
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from models import Users
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post('/create', status_code=status.HTTP_201_CREATED)
async def user_create(user: UserRegistrationSchema, session: SessionDep):
    """Registration"""
    if user.password != user.password2:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if await get_user_by_email(user.email, session):
        raise HTTPException(status_code=400, detail="Email is already taken")

    if await nickname_check(user.nickname, session):
        raise HTTPException(status_code=400, detail="Nickname is already taken")

    try:
        user = await add_user(user, session)
        token = await create_token_verify(user.id, purpose='email', session=session)
        await asyncio.create_task(send_confirm_email(user.email, user.nickname, token))

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post('/login')
async def user_login(userbase: UserLoginSchema, session: SessionDep, response: Response):
    """
    Login
    format: email, password
    """

    user = await get_user_by_email(userbase.email, session)

    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect credentials")

    if not verify_password(userbase.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Your account is not active')
    
    if not user.is_email_verified:
        old_token = await session.scalar(select(Email_tokens).where(Email_tokens.user_id == user.id))

        if old_token:
            await session.delete(old_token)
            await session.commit()

        token = await create_token_verify(user.id, purpose='email', session=session)
        await asyncio.create_task(send_confirm_email(user.email, user.nickname, token))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Verification email has been sent to your address')

    refresh_token = create_refresh_token({"sub": str(user.id)})
    access_token = create_access_token({"sub": str(user.id)})

    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True,
        secure=False,
        samesite="lax" 
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post('/logout')
async def logout(response: Response):
    """
        logout endpoint, clears the refresh token cookie
    """
    response.delete_cookie(key="refresh_token")
    return {'status': 'ok'}


@router.get('/token', status_code=status.HTTP_200_OK)
async def access_token_validation(token: str = Security(oauth2_scheme)):
    """Validate JWT (access_token) returns user_id from it"""

    return access_token_valid(token)

@router.post("/refresh")
async def web_refresh_token_validator(request: Request, response: Response):
    """
        refresh token endpoint, requires refresh token in cookie
    """
    try:
        refresh_token = request.cookies.get("refresh_token")
        payload = jwt.decode(refresh_token, os.getenv('SECRET_KEY'), algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        new_access_token = create_access_token({"sub": user_id})
        return {"access_token": new_access_token, "token_type": "bearer"}

    except jwt.PyJWTError:
        response.delete_cookie("refresh_token")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token")
    

@router.patch('/email/verify/{token}', status_code=status.HTTP_200_OK)
async def verify_email(token: str, session: SessionDep):    
    token_db = await session.execute(
        select(Email_tokens)
        .where(Email_tokens.token == token)
        .options(joinedload(Email_tokens.user)))
    
    result = token_db.scalar_one_or_none()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Token doesnt exists. Please log in to request a new confirmation email")
    
    if result.user.is_email_verified:
        return JSONResponse(
            status_code=status.HTTP_208_ALREADY_REPORTED,
            content={
                'status': 'ok',
                'detail': 'You have already confirmed your email address'
            }
        )
    
    exp = result.expires_at
    if exp.tzinfo is None:  # костыль для sqlite
        exp = exp.replace(tzinfo=timezone.utc)

    if exp < datetime.now(timezone.utc):
        await session.delete(result)
        await session.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Token is expired. Please log in to request a new confirmation email.")
    
    if result.purpose != "email":
        raise HTTPException(status_code=400, detail="Wrong token purpose")
    
    result.user.is_email_verified = True
    await session.delete(result)
    await session.commit()

    return {'status': 'ok', 'detail': 'email address was confirmed'}
    

@router.patch('/password/verify/{token}', status_code=status.HTTP_200_OK)
async def password_change(
    session: SessionDep,
    token: str
    ) -> dict:
    token_db = await session.execute(
        select(Email_tokens)
        .where(Email_tokens.token == token))
    
    result = token_db.scalar_one_or_none()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Token doesnt exists. Please create a new token through password restore form")

    exp = result.expires_at
    if exp.tzinfo is None:  # костыль для sqlite
        exp = exp.replace(tzinfo=timezone.utc)

    if exp < datetime.now(timezone.utc):
        await session.delete(result)
        await session.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Token doesnt exists. Please create a new token through password restore form")
    
    if result.purpose != "password":
        raise HTTPException(status_code=400, detail="Wrong token purpose")

    return {'status': 'ok'}


@router.patch('/password/change/{token}')
async def password_change(
    payload: PasswordRestore,
    session: SessionDep,
    token: str = Path(..., description="Reset token from email"),
    ) -> dict:
    token_db = await session.execute(
        select(Email_tokens)
        .where(Email_tokens.token == token)
        .options(joinedload(Email_tokens.user)))
    
    result = token_db.scalar_one_or_none()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                            detail="Token doesnt exists. Please create a new token through password restore form")

    exp = result.expires_at
    if exp.tzinfo is None:  # костыль для sqlite
        exp = exp.replace(tzinfo=timezone.utc)

    if exp < datetime.now(timezone.utc):
        await session.delete(result)
        await session.commit()
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Token doesnt exists. Please create a new token through password restore form")
    
    if result.purpose != "password":
        raise HTTPException(status_code=400, detail="Wrong token purpose")
    
    if payload.password:
        result.user.hashed_password = hash_password(payload.password)
        session.delete(result)
        session.commit()
        return {'status': 'ok', 'detail': 'Password is successfully changed'}
    return {'status': 'ok'}



@router.post('/password/token/create', status_code=status.HTTP_201_CREATED)
async def restore_password_token_create(payload: EmailRequest, session: SessionDep) -> dict:
    """creates token and saves token to db for restoring password"""
    user = await session.scalar(select(Users).where(Users.email == payload.email))

    if not user:
        return {'status': 'ok', 'detail': "Password reset link has been sent"}
    
    token = await create_token_verify(user.id, 'password', session=session)
    await asyncio.create_task(send_reset_password(user.email, user.nickname, token))


    return {'status': 'ok', 'detail': "Password reset link has been sent"}


import logging
import os
import jwt

from fastapi import APIRouter, status, HTTPException, Security, Request, Response
from database_settings import SessionDep
from schemas import UserRegistrationSchema, UserLoginSchema, RefreshTokenSchema
from services import add_user, nickname_check, get_user_by_email, verify_password, access_token_valid, create_refresh_token, \
    create_access_token, ALGORITHM, JWT_SECRET_KEY
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer


router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.post('/create', status_code=status.HTTP_201_CREATED)
async def user_create(userbase: UserRegistrationSchema, session: SessionDep):
    """Registration endpoint."""
    if userbase.password != userbase.password2:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if await get_user_by_email(userbase.email, session):
        raise HTTPException(status_code=400, detail="Email is already taken")

    if await nickname_check(userbase.nickname, session):
        raise HTTPException(status_code=400, detail="Nickname is already taken")

    try:
        await add_user(userbase, session)

    except Exception as error:
        logging.exception(error)
        raise HTTPException(status_code=500, detail="Server is dead at the moment")


@router.post('/login')
async def user_login(userbase: UserLoginSchema, session: SessionDep, response: Response):
    """Login endpoint.
    format: email, password
    """

    user = await get_user_by_email(userbase.email, session)


    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")

    if not verify_password(userbase.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")

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

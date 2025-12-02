import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from sqlalchemy import select, exists
from models import Users
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
import secrets
from models import Email_tokens
import logging
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

JWT_SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    """transform user's password to hashed password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that the login password matches the hashed password from the database"""
    return pwd_context.verify(plain_password, hashed_password)


async def get_user_by_email(email: str, session: dict):
    """check if user with given email exists, gives none if not"""
    stmt = select(Users).where(Users.email == email)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    return user


async def nickname_check(nickname: str, session: dict):
    stmt = select(
        exists().where(Users.nickname == nickname)
    )
    return await session.scalar(stmt)


async def add_user(userbase: dict, session: dict):
    """Adds a new user to the database"""
    try:
        user_data = userbase.model_dump()
        user_data['hashed_password'] = hash_password(user_data.pop('password'))
        user_data.pop('password2')
        user = Users(**user_data)
        session.add(user)
        await session.flush()
        await session.commit()
        return user     

    except Exception as e:
        await session.rollback()
        raise e
    


def create_refresh_token(data: dict, expires_in: int = REFRESH_TOKEN_EXPIRE_DAYS):
    """Creates a new refresh token"""
    payload = data.copy()
    exp = datetime.utcnow() + timedelta(days=expires_in)
    payload.update({'exp': exp})
    token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm=ALGORITHM)
    return token


def create_access_token(data: dict, expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    """Creates a new access token"""
    payload = data.copy()
    exp = datetime.utcnow() + timedelta(minutes=expires_in)
    payload.update({'exp': exp})
    token = jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm=ALGORITHM)
    return token


def access_token_valid(token: str = Depends(oauth2_scheme)) -> int:
    """validate access token for auth"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return int(user_id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token expired")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or tampered token")
    
    
async def create_token_verify(user_id: int, purpose: str, session):
    """creates verify token to verify user"""
    try:
        token = secrets.token_urlsafe(48)

        new_record = Email_tokens(
        user_id=user_id,
        token=token,
        purpose=purpose
        )

        session.add(new_record)
        await session.commit()
        return token
    
    except Exception as e:
        logging.error(e)

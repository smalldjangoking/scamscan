import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from sqlalchemy import select, exists
from models import UserModel
from passlib.context import CryptContext

load_dotenv()

JWT_SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """transform user's password to hashed password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that the login password matches the hashed password from the database"""
    return pwd_context.verify(plain_password, hashed_password)


async def get_user_by_email(email: str, session: dict):
    """check if user with given email exists, gives none if not"""
    stmt = select(UserModel).where(UserModel.email == email)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()  # вернёт объект UserModel или None
    return user

async def nickname_check(nickname: str , session: dict):
    stmt = select(
        exists().where(UserModel.nickname == nickname)
    )
    return await session.scalar(stmt)


async def add_user(userbase: dict, session: dict):
    """Adds a new user to the database"""
    try:
        user_data = userbase.model_dump()
        user_data['hashed_password'] = hash_password(user_data.pop('password'))
        user_data.pop('password_confirmation')
        session.add(UserModel(**user_data))
        await session.commit()
        return True

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

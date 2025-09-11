import os
from urllib import response
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from sqlalchemy import select, exists
from models import UserModel
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

JWT_SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")




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
    user = result.scalar_one_or_none()
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



async def validationJWT_or_401(
    request: Request,
    response: Response,
    token: str = Depends(oauth2_scheme)
):
    """
    Accepts access_token -> gives user_id if token is valid
    _____________________________________________________________
    Validates the JWT token, checks access_token or creates new access_token using refresh_token
       or raises 401 error if both tokens are invalid
    ______________________________________________________________
    """

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return user_id

    except Exception as e:
        if isinstance(e, jwt.ExpiredSignatureError):
            refresh_token = request.cookies.get("refresh_token", None)

            if not refresh_token:
                raise HTTPException(status_code=401, detail="Could not validate credentials")

            try:
                user_id = jwt.decode(refresh_token, JWT_SECRET_KEY, algorithms=[ALGORITHM]).get("sub")
                new_accessJWT = create_access_token({"sub": user_id})
                response.headers["X-New-Access-Token"] = new_accessJWT
                return user_id

            except jwt.ExpiredSignatureError:
                response.headers["X-New-Access-Token"] = ""
                response.delete_cookie("refresh_token")
                raise HTTPException(status_code=401, detail="Could not validate credentials")
            except jwt.DecodeError:
                raise HTTPException(status_code=401, detail="Could not validate credentials")
            except Exception:
                raise HTTPException(status_code=401, detail="Could not validate credentials")


        if isinstance(e, jwt.InvalidTokenError):
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        if isinstance(e, jwt.DecodeError):
            raise HTTPException(status_code=401, detail="Could not validate credentials")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )


        
        
       


from sqlalchemy import select, exists
from models import UserModel
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


#checks if email exists in User database
async def email_check(email, session):
    stmt = select(
        exists().where(UserModel.email == email)
    )
    return await session.scalar(stmt)

async def nickname_check(nickname, session):
    stmt = select(
        exists().where(UserModel.nickname == nickname)
    )
    return await session.scalar(stmt)


#adds new User to database
async def add_user(userbase, session):
    try:
        user_data = userbase.model_dump()
        user_data['hashed_password'] = hash_password(user_data.pop('password'))
        session.add(UserModel(**user_data))
        await session.commit()
        return True

    except Exception as e:
        await session.rollback()
        raise e
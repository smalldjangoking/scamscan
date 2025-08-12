from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

engine = create_async_engine('sqlite+aiosqlite:///database.db', echo=True)

new_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_session():
    async with new_session() as session:
        yield session

class Base(DeclarativeBase):
    pass

DBSession = Annotated[AsyncSession, Depends(get_session)]

#Init.py
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
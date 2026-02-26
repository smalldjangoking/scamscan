from typing import Annotated
import os
from fastapi import Depends
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from settings import settings

engine = create_async_engine(settings.DATABASE_URL)

new_session = async_sessionmaker[AsyncSession](engine, expire_on_commit=False, future=True)

async def get_session():
    async with new_session() as session:
        yield session

SessionDep = Annotated[AsyncSession, Depends(get_session)]
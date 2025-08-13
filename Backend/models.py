from datetime import datetime
from sqlalchemy import DateTime, func, String, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from database_settings import engine


class Base(DeclarativeBase):
    pass

class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str]
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    surname: Mapped[str | None] = mapped_column(String, nullable=True)
    is_verified: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    is_superuser: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    is_email_verified: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    nickname: Mapped[str | None] = mapped_column(String, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_login: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
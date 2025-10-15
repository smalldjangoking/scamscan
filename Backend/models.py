from datetime import datetime
from sqlalchemy import DateTime, func, String, Boolean, JSON, Integer
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from database_settings import engine


class Base(DeclarativeBase):
    pass

class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[str]
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    surname: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    nickname: Mapped[str | None] = mapped_column(String, unique=True, nullable=False)

    is_verified: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    is_superuser: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    is_email_verified: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_login: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    
    reports: Mapped[list["Reports"]] = relationship(back_populates="user")
    comments: Mapped[list["Comments"]] = relationship(back_populates="user")


class Reports(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    report_subject: Mapped[str] = mapped_column(String, nullable=False)
    report_title: Mapped[str] = mapped_column(String(50), nullable=False)
    report_description: Mapped[str] = mapped_column(String(2000), nullable=False)
    screenshots: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    address: Mapped[str] = mapped_column(ForeignKey("addresses.id"), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    views: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    
    user: Mapped["Users"] = relationship(back_populates="reports")
    comments: Mapped[list["Comments"]] = relationship(back_populates="report")


class Addresses(Base):
    __tablename__ = "address"

    id: Mapped[int] = mapped_column(primary_key=True)
    website_url: Mapped[str | None] = mapped_column(String, nullable=True, index=True)
    crypto_address: Mapped[str | None] = mapped_column(String, nullable=True, index=True)
    crypto_name: Mapped[str | None] = mapped_column(String, nullable=True)
    crypto_logo_url: Mapped[str | None] = mapped_column(String, nullable=True)

    likes: Mapped[int] = mapped_column(Integer, default=0)
    dislikes: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Comments(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("reports.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    report: Mapped["Reports"] = relationship(back_populates="comments")
    user: Mapped["Users"] = relationship(back_populates="comments")



async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
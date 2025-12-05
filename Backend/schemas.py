from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, model_validator, ConfigDict, Field
from typing import Annotated

class UserRegistrationSchema(BaseModel):
    email: EmailStr
    password: Annotated[
        str,
        Field(
            min_length=8,
            max_length=64,
            pattern=r'^[A-Za-z0-9@#$%^&+=!?._-]+$'
        )
    ]
    password2: str
    nickname: Annotated[
        str,
        Field(
            min_length=3,
            max_length=24,
            pattern=r'^[A-Za-z0-9_]+$'
        )
    ]


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenSchema(BaseModel):
    refresh_token: str


class ChangePasswordSchema(BaseModel):
    new_password: str


class UpdateUserInfoSchema(BaseModel):
    name: str | None = None
    surname: str | None = None
    nickname: str | None = None

class UserVote(BaseModel):
    value: int

    @model_validator(mode="after")
    def vote_number_of_two(cls, data):
        if data.value not in [-1, 1]:
            raise ValueError("Vote must be only in two positions")
        return data

class ReportSchema(BaseModel):
    subject: str
    report_title: str
    report_description: str
    website_url: str | None = None
    crypto_address: str | None = None
    crypto_name: str | None = None
    crypto_logo_url: str | None = None
    screenshots: list[str] | None = None

    @model_validator(mode="after")
    def both_subjects_not_allowed(cls, data):
        if data.subject == "crypto" and (data.website_url is not None):
            raise ValueError("website_url must be None when subject is 'crypto'")
        if data.subject == "website" and (data.crypto_address is not None or data.crypto_name is not None):
            raise ValueError("crypto_address and crypto_name must be None when subject is 'website'")
        return data
    
    @model_validator(mode="after")
    def subject_one_of_two(cls, data):
        if data.subject not in ["crypto", "website"]:
            raise ValueError("subject must be either 'crypto' or 'website'")
        return data

class AddressAPISchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    website_url: str | None = None
    crypto_address: str | None = None
    crypto_name: str | None = None
    crypto_logo_url: str | None = None
    subject: str | None = None
    created_at: datetime | None = None


class ReportAPISchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_title: str
    user_id: int | None = None
    report_description: str
    address: AddressAPISchema | None = None
    slug: str
    created_at: datetime
    views: int

class ReportsListAPISchema(BaseModel):
    reports: list[ReportAPISchema]
    totalPages: int

class AddressReportSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    report_title: str 
    report_description: str
    address_id: int | None = None
    slug: str
    created_at: datetime
    views: int
    comments_count: int | None = None

class AddressListReportSchema(BaseModel):
    reports: list[AddressReportSchema]
    totalPages: int
    total_reports: int


class SubjectEnum(str, Enum):
    crypto = "crypto"
    website = "website"


class SingleReport(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None
    user_id: int | None = None
    report_title: str
    report_description: str
    address_id: int
    slug: str
    created_at: datetime
    views: int

class PublicUserAPISchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int = Field(alias="id")
    nickname: str

class SingleReportSchema(BaseModel):
    address: AddressAPISchema
    report: SingleReport
    user: PublicUserAPISchema | None = None

class CommentUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nickname: str

class CommentSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    comment: str
    created_at: datetime
    children: list['CommentReply'] | None = None
    user: CommentUser

class CommentReply(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    comment: str
    created_at: datetime
    user: CommentUser


class CommentsSchema(BaseModel):
    comments: list[CommentSchema]
    comments_total: int
    total_pages: int

class CommentValid(BaseModel):
    parent_comment_id: int | None = None
    comment: str

class PasswordRestore(BaseModel):
    password: str | None = None

class EmailRequest(BaseModel):
    email: EmailStr









    
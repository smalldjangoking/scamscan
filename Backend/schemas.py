from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, model_validator, ConfigDict


class UserRegistrationSchema(BaseModel):
    email: EmailStr
    password: str
    password_confirmation: str
    nickname: str


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenSchema(BaseModel):
    refresh_token: str


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str


class UpdateUserInfoSchema(BaseModel):
    name: str | None = None
    surname: str | None = None
    nickname: str | None = None
    phone: str | None = None

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

class AddressListReportSchema(BaseModel):
    reports: list[AddressReportSchema]
    totalPages: int


class SubjectEnum(str, Enum):
    crypto = "crypto"
    website = "website"




    
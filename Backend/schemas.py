from pydantic import BaseModel, EmailStr, model_validator


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


class ChagnePasswordSchema(BaseModel):
    old_password: str
    new_password: str


class UpdateUserInfoSchema(BaseModel):
    name: str | None = None
    surname: str | None = None
    nickname: str | None = None
    phone: str | None = None

class ReportSchema(BaseModel):
    report_subject: str
    report_title: str
    report_description: str
    website_url: str | None = None
    crypto_address: str | None = None
    crypto_name: str | None = None
    crypto_logo_url: str | None = None
    screenshots: list[str] | None = None

    @model_validator(mode="after")
    def both_subjects_not_allowed(cls, data):
        if data.report_subject == "crypto" and (data.website_url is not None):
            raise ValueError("website_url must be None when report_subject is 'crypto'")
        if data.report_subject == "website" and (data.crypto_address is not None or data.crypto_name is not None):
            raise ValueError("crypto_address and crypto_name must be None when report_subject is 'website'")
        return data
    
    @model_validator(mode="after")
    def subject_one_of_two(cls, data):
        if data.report_subject not in ["crypto", "website"]:
            raise ValueError("report_subject must be either 'crypto' or 'website'")
        return data




    
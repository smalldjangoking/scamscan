from pydantic import BaseModel, EmailStr


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

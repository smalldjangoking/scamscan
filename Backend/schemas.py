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
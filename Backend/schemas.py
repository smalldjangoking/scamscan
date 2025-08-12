from pydantic import BaseModel, EmailStr

#User authorization schema
class UserBase(BaseModel):
    email: EmailStr
    password: str
    nickname: str
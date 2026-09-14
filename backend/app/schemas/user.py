from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    ConfigDict
)


class UserCreate(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=100,
        description="Username"
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=100,
        description="Password"
    )

    # Prevent users from sending role="admin"
    # during registration
    model_config = ConfigDict(
        extra="forbid"
    )


class UserLogin(BaseModel):
    email: EmailStr

    password: str

    role: Literal[
        "user",
        "admin"
    ] = "user"


class UserResponse(BaseModel):
    id: int

    username: str

    email: EmailStr

    role: str

    is_active: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class Token(BaseModel):
    access_token: str

    token_type: str
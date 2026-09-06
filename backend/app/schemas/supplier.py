from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class SupplierCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str


class SupplierUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str


class SupplierResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    address: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
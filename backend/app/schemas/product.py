from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    sku: str
    barcode: str | None = None
    price: float
    quantity: int = 0
    minimum_stock: int = 5
    image_url: str | None = None
    category_id: int


class ProductUpdate(BaseModel):
    name: str
    description: str | None = None
    sku: str
    barcode: str | None = None
    price: float
    quantity: int
    minimum_stock: int
    image_url: str | None = None
    category_id: int


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    sku: str
    barcode: str | None
    price: float
    quantity: int
    minimum_stock: int
    image_url: str | None
    category_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    
class ProductListResponse(BaseModel):
    total: int
    items: list[ProductResponse]
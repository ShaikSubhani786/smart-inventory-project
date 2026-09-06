from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SaleCreate(BaseModel):
    product_id: int
    quantity: int
    price: float


class SaleResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    total_amount: float
    sold_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
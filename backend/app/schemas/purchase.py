from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PurchaseCreate(BaseModel):
    supplier_id: int
    product_id: int
    quantity: int
    purchase_price: float


class PurchaseResponse(BaseModel):
    id: int
    supplier_id: int
    product_id: int
    quantity: int
    purchase_price: float
    total_amount: float
    purchased_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
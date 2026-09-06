from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class StockIn(BaseModel):
    product_id: int
    quantity: int
    remarks: Optional[str] = None


class StockOut(BaseModel):
    product_id: int
    quantity: int
    remarks: Optional[str] = None


class TransactionResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    transaction_type: str
    quantity: int
    remarks: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
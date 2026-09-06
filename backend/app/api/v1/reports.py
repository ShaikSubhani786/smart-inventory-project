from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports"]
)
from app.crud.report import low_stock_products
from app.schemas.product import ProductResponse


@router.get(
    "/low-stock",
    response_model=list[ProductResponse]
)
def get_low_stock_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return low_stock_products(db)
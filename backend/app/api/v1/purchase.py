from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import (
    get_current_user,
    require_admin
)
from app.models.user import User

from app.schemas.purchase import (
    PurchaseCreate,
    PurchaseResponse
)

from app.crud.purchase import (
    create_purchase,
    get_purchases,
    get_purchase
)

router = APIRouter(
    prefix="/api/v1/purchases",
    tags=["Purchases"]
)


# -------------------------------------------------
# CREATE PURCHASE
# Admin only
# -------------------------------------------------

@router.post(
    "/",
    response_model=PurchaseResponse,
    status_code=status.HTTP_201_CREATED
)
def add_purchase(
    purchase: PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    new_purchase = create_purchase(
        db,
        purchase,
        current_user.id
    )

    if new_purchase is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier or Product not found"
        )

    return new_purchase


# -------------------------------------------------
# GET ALL PURCHASES
# Any logged-in user
# -------------------------------------------------

@router.get(
    "/",
    response_model=list[PurchaseResponse]
)
def read_purchases(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_purchases(db)


# -------------------------------------------------
# GET PURCHASE BY ID
# Any logged-in user
# -------------------------------------------------

@router.get(
    "/{purchase_id}",
    response_model=PurchaseResponse
)
def read_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    purchase = get_purchase(
        db,
        purchase_id
    )

    if purchase is None:
        raise HTTPException(
            status_code=404,
            detail="Purchase not found"
        )

    return purchase
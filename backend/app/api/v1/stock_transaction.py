from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import (
    get_current_user,
    require_admin
)
from app.models.user import User

from app.schemas.stock_transaction import (
    StockIn,
    StockOut,
    TransactionResponse
)

from app.crud.stock_transaction import (
    stock_in,
    stock_out,
    get_transaction_history
)

router = APIRouter(
    prefix="/api/v1/stock",
    tags=["Stock Transactions"]
)


# -------------------------------------------------
# STOCK IN
# Admin only
# -------------------------------------------------

@router.post(
    "/in",
    response_model=TransactionResponse
)
def add_stock(
    data: StockIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    transaction = stock_in(
        db,
        data,
        current_user.id
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return transaction


# -------------------------------------------------
# STOCK OUT
# Admin only
# -------------------------------------------------

@router.post(
    "/out",
    response_model=TransactionResponse
)
def remove_stock(
    data: StockOut,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    try:
        transaction = stock_out(
            db,
            data,
            current_user.id
        )

        if transaction is None:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return transaction

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# -------------------------------------------------
# STOCK HISTORY
# Any logged-in user
# -------------------------------------------------

@router.get(
    "/history",
    response_model=list[TransactionResponse]
)
def transaction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_transaction_history(db)
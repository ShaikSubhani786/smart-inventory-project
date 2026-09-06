from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User

from app.schemas.sale import (
    SaleCreate,
    SaleResponse
)

from app.crud.sale import (
    create_sale,
    get_sales,
    get_sale
)

router = APIRouter(
    prefix="/api/v1/sales",
    tags=["Sales"]
)


@router.post(
    "/",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED
)
def make_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        new_sale = create_sale(
            db,
            sale,
            current_user.id
        )

        if new_sale is None:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )

        return new_sale

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/",
    response_model=list[SaleResponse]
)
def read_sales(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_sales(db)


@router.get(
    "/{sale_id}",
    response_model=SaleResponse
)
def read_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sale = get_sale(db, sale_id)

    if sale is None:
        raise HTTPException(
            status_code=404,
            detail="Sale not found"
        )

    return sale
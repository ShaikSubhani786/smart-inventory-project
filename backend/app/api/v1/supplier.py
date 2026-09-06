from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import User

from app.crud.supplier import (
    create_supplier,
    get_suppliers,
    get_supplier,
    update_supplier,
    delete_supplier
)

from app.schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse
)

router = APIRouter(
    prefix="/api/v1/suppliers",
    tags=["Suppliers"]
)


@router.post(
    "/",
    response_model=SupplierResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return create_supplier(db, supplier)


@router.get(
    "/",
    response_model=list[SupplierResponse]
)
def read_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_suppliers(db)


@router.get(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def read_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    supplier = get_supplier(db, supplier_id)

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse
)
def edit_supplier(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    updated_supplier = update_supplier(
        db,
        supplier_id,
        supplier
    )

    if updated_supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return updated_supplier


@router.delete(
    "/{supplier_id}"
)
def remove_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    supplier = delete_supplier(
        db,
        supplier_id
    )

    if supplier is None:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return {
        "message": "Supplier deleted successfully"
    }
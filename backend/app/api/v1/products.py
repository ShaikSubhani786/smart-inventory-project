from fastapi import APIRouter, Depends, HTTPException, status , UploadFile, File
import os
import shutil
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import (
    get_current_user,
    require_admin
)

from app.models.user import User
from app.models.category import Category
from app.models.product import Product

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)

from app.crud.product import (
    create_product,
    get_products,
    get_product,
    update_product,
    delete_product
)


router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"]
)


# -------------------------------------------------
# CREATE PRODUCT
# Admin only
# -------------------------------------------------
@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Check whether category exists
    category = (
        db.query(Category)
        .filter(Category.id == product.category_id)
        .first()
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Check whether SKU already exists
    existing_product = (
        db.query(Product)
        .filter(Product.sku == product.sku)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )

    return create_product(db, product)


# -------------------------------------------------
# GET ALL PRODUCTS
# Search + Category Filter + Pagination + Sorting
# -------------------------------------------------
@router.get(
    "/",
    response_model=ProductListResponse
)
def read_products(
    search: str | None = None,
    category_id: int | None = None,
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_products(
        db=db,
        search=search,
        category_id=category_id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        order=order
    )
# -------------------------------------------------
# UPLOAD PRODUCT IMAGE
# Admin only
# -------------------------------------------------
@router.post("/{product_id}/image")
def upload_product_image(
    product_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    product = get_product(
        db,
        product_id
    )

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    upload_folder = "uploads/products"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_extension = os.path.splitext(
        image.filename
    )[1]

    filename = f"product_{product_id}{file_extension}"

    file_path = os.path.join(
        upload_folder,
        filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            image.file,
            buffer
        )

    product.image_url = f"/uploads/products/{filename}"

    db.commit()
    db.refresh(product)

    return {
        "message": "Product image uploaded successfully",
        "image_url": product.image_url
    }


# -------------------------------------------------
# GET PRODUCT BY ID
# -------------------------------------------------
@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def read_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = get_product(
        db,
        product_id
    )

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


# -------------------------------------------------
# UPDATE PRODUCT
# Admin only
# -------------------------------------------------
@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_existing_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Check category before updating
    category = (
        db.query(Category)
        .filter(Category.id == product.category_id)
        .first()
    )

    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    updated_product = update_product(
        db,
        product_id,
        product
    )

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return updated_product


# -------------------------------------------------
# DELETE PRODUCT
# Admin only
# -------------------------------------------------
@router.delete(
    "/{product_id}"
)
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    deleted_product = delete_product(
        db,
        product_id
    )

    if deleted_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {
        "message": "Product deleted successfully"
    }
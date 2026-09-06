from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import User

from app.crud.category import (
    create_category,
    get_categories,
    get_category,
    get_category_by_name,
    update_category,
    delete_category
)

from app.schemas.category import (
    CategoryCreate,
    CategoryResponse
)
from app.models.category import Category

router = APIRouter(
    prefix="/api/v1/categories",
    tags=["Categories"]
)
@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing = get_category_by_name(
        db,
        category.name
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Category already exists"
        )

    return create_category(
        db,
        category
    )
@router.get("/", response_model=list[CategoryResponse])
def read_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Category).all()
@router.get(
    "/{category_id}",
    response_model=CategoryResponse
)
def read_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    category = get_category(
        db,
        category_id
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    return category
@router.put(
    "/{category_id}",
    response_model=CategoryResponse
)
def edit_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_category = get_category(
        db,
        category_id
    )

    if not db_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    return update_category(
        db,
        db_category,
        category
    )
@router.delete("/{category_id}")
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_category = get_category(
        db,
        category_id
    )

    if not db_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    delete_category(
        db,
        db_category
    )

    return {
        "message": "Category deleted successfully"
    }

from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(db: Session, product: ProductCreate):
    db_product = Product(**product.model_dump())

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


def get_products(
    db: Session,
    search: str = None,
    category_id: int = None,
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "id",
    order: str = "asc"
):
    query = db.query(Product)

    # Search
    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%")
        )

    # Category filter
    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )

    total = query.count()

    # Safe sorting
    allowed_sort_fields = [
        "id",
        "name",
        "price",
        "quantity",
        "sku"
    ]

    if sort_by not in allowed_sort_fields:
        sort_by = "id"

    sort_column = getattr(Product, sort_by)

    if order.lower() == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    products = query.offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": products
    }


# IMPORTANT: This must be outside get_products()
def get_product(db: Session, product_id: int):
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )


def update_product(
    db: Session,
    product_id: int,
    product: ProductUpdate,
):
    db_product = get_product(db, product_id)

    if not db_product:
        return None

    for key, value in product.model_dump().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return db_product


def delete_product(
    db: Session,
    product_id: int,
):
    db_product = get_product(db, product_id)

    if not db_product:
        return None

    db.delete(db_product)
    db.commit()

    return db_product
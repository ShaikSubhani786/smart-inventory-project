from sqlalchemy.orm import Session

from app.models.sale import Sale
from app.models.product import Product
from app.schemas.sale import SaleCreate


def create_sale(
    db: Session,
    sale: SaleCreate,
    user_id: int
):
    product = db.query(Product).filter(
        Product.id == sale.product_id
    ).first()

    if not product:
        return None

    if product.quantity < sale.quantity:
        raise ValueError("Insufficient stock")

    product.quantity -= sale.quantity

    db_sale = Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        price=sale.price,
        total_amount=sale.quantity * sale.price,
        sold_by=user_id
    )

    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    return db_sale


def get_sales(db: Session):
    return db.query(Sale).all()


def get_sale(db: Session, sale_id: int):
    return db.query(Sale).filter(
        Sale.id == sale_id
    ).first()
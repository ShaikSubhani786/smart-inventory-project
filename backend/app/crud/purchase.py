from sqlalchemy.orm import Session

from app.models.purchase import Purchase
from app.models.product import Product
from app.models.supplier import Supplier

from app.schemas.purchase import PurchaseCreate


def create_purchase(
    db: Session,
    purchase: PurchaseCreate,
    user_id: int
):
    supplier = db.query(Supplier).filter(
        Supplier.id == purchase.supplier_id
    ).first()

    if supplier is None:
        return None

    product = db.query(Product).filter(
        Product.id == purchase.product_id
    ).first()

    if product is None:
        return None

    # Increase stock
    product.quantity += purchase.quantity

    db_purchase = Purchase(
        supplier_id=purchase.supplier_id,
        product_id=purchase.product_id,
        quantity=purchase.quantity,
        purchase_price=purchase.purchase_price,
        total_amount=purchase.quantity * purchase.purchase_price,
        purchased_by=user_id
    )

    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)

    return db_purchase


def get_purchases(db: Session):
    return db.query(Purchase).all()


def get_purchase(db: Session, purchase_id: int):
    return db.query(Purchase).filter(
        Purchase.id == purchase_id
    ).first()
from sqlalchemy.orm import Session

from app.models.product import Product
from app.models.stock_transaction import StockTransaction
from app.schemas.stock_transaction import StockIn, StockOut


def stock_in(db: Session, data: StockIn, user_id: int):
    product = db.query(Product).filter(
        Product.id == data.product_id
    ).first()

    if not product:
        return None

    # Increase stock
    product.quantity += data.quantity

    transaction = StockTransaction(
        product_id=data.product_id,
        user_id=user_id,
        transaction_type="IN",
        quantity=data.quantity,
        remarks=data.remarks
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction


def stock_out(db: Session, data: StockOut, user_id: int):
    product = db.query(Product).filter(
        Product.id == data.product_id
    ).first()

    if not product:
        return None

    if product.quantity < data.quantity:
        raise ValueError("Insufficient stock")

    # Decrease stock
    product.quantity -= data.quantity

    transaction = StockTransaction(
        product_id=data.product_id,
        user_id=user_id,
        transaction_type="OUT",
        quantity=data.quantity,
        remarks=data.remarks
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction
def get_transaction_history(db: Session):
    return (
        db.query(StockTransaction)
        .order_by(StockTransaction.created_at.desc())
        .all()
    )
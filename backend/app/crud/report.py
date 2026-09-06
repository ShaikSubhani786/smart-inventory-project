from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.product import Product
from app.models.sale import Sale
from app.models.purchase import Purchase
def low_stock_products(db: Session):
    return (
        db.query(Product)
        .filter(Product.quantity <= 10)
        .all()
    )
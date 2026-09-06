from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.product import Product
from app.models.category import Category


def get_dashboard_data(db: Session):

    total_products = db.query(Product).count()

    total_categories = db.query(Category).count()

    total_stock = db.query(
        func.sum(Product.quantity)
    ).scalar() or 0

    low_stock_products = db.query(Product).filter(
        Product.quantity <= 10
    ).count()

    out_of_stock_products = db.query(Product).filter(
        Product.quantity == 0
    ).count()

    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_stock": total_stock,
        "low_stock_products": low_stock_products,
        "out_of_stock_products": out_of_stock_products
    }
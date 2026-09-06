from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate


def create_category(db: Session, category: CategoryCreate):
    db_category = Category(
        name=category.name,
        description=category.description
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


def get_categories(db: Session):
    return db.query(Category).all()


def get_category(db: Session, category_id: int):
    return (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )


def get_category_by_name(db: Session, name: str):
    return (
        db.query(Category)
        .filter(Category.name == name)
        .first()
    )


def update_category(
    db: Session,
    db_category: Category,
    category: CategoryCreate
):
    db_category.name = category.name
    db_category.description = category.description

    db.commit()
    db.refresh(db_category)

    return db_category


def delete_category(
    db: Session,
    db_category: Category
):
    db.delete(db_category)
    db.commit()
from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    Float,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.database.base import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    sku: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    barcode: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=True
    )

    price: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    minimum_stock: Mapped[int] = mapped_column(
        Integer,
        default=5
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    # Relationship
    category = relationship(
        "Category",
        back_populates="products"
    )
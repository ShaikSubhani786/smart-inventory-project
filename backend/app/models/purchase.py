from datetime import datetime

from sqlalchemy import ForeignKey, Integer, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    supplier_id: Mapped[int] = mapped_column(
        ForeignKey("suppliers.id")
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id")
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    purchase_price: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    total_amount: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    purchased_by: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )
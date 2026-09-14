"""change staff role to user

Revision ID: fe88bc499699
Revises: 788d8da5da61
Create Date: 2026-09-14 17:03:44.792507

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe88bc499699'
down_revision: Union[str, None] = '788d8da5da61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # Convert existing staff accounts
    # into normal user accounts
    op.execute(
        """
        UPDATE users
        SET role = 'user'
        WHERE role = 'staff'
           OR role IS NULL
        """
    )

    # Change database default
    # from staff to user
    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(length=20),
        nullable=False,
        server_default="user"
    )


def downgrade() -> None:

    # Restore old database default
    op.alter_column(
        "users",
        "role",
        existing_type=sa.String(length=20),
        nullable=False,
        server_default="staff"
    )

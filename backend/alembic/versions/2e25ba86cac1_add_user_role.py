"""add user role

Revision ID: 2e25ba86cac1
Revises: 5b45b372a9cc
Create Date: 2026-09-28
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2e25ba86cac1"
down_revision: Union[str, Sequence[str], None] = "5b45b372a9cc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


user_role_enum = sa.Enum(
    "ADMIN",
    "DEVELOPER",
    "VIEWER",
    name="userrole",
)


def upgrade() -> None:
    # Create PostgreSQL enum type first
    user_role_enum.create(
        op.get_bind(),
        checkfirst=True,
    )

    # Add role column with a temporary server default
    op.add_column(
        "users",
        sa.Column(
            "role",
            user_role_enum,
            nullable=False,
            server_default="DEVELOPER",
        ),
    )

    # Remove server default after existing rows are populated
    op.alter_column(
        "users",
        "role",
        server_default=None,
    )


def downgrade() -> None:
    # Remove column first
    op.drop_column(
        "users",
        "role",
    )

    # Then remove PostgreSQL enum type
    user_role_enum.drop(
        op.get_bind(),
        checkfirst=True,
    )
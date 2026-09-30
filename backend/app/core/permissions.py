from fastapi import HTTPException, status

from app.models.user import User, UserRole


def require_admin(
    current_user: User,
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )


def require_admin_or_developer(
    current_user: User,
):
    if current_user.role not in {
        UserRole.ADMIN,
        UserRole.DEVELOPER,
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or developer access required",
        )


def require_assigned_developer_or_admin(
    current_user: User,
    assigned_to: int | None,
):
    if current_user.role == UserRole.ADMIN:
        return

    if current_user.role == UserRole.DEVELOPER:
        if assigned_to == current_user.id:
            return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You are not allowed to modify this bug",
    )
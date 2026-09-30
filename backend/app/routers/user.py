from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.permissions import require_admin
from app.core.auth import get_current_user

from app.database.dependencies import get_db

from app.models.user import User
from app.models.bug import Bug

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserRoleUpdate,
)

from app.services.security import (
    hash_password,
    create_access_token,
    verify_password,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# =========================
# GET CURRENT USER
# =========================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


# =========================
# GET ALL USERS
# ADMIN ONLY
# =========================

@router.get(
    "/",
    response_model=list[UserResponse],
)
def get_users(
    search: str | None = None,
    role: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    require_admin(current_user)

    query = db.query(User)

    # Search by name or email
    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            (User.name.ilike(search_pattern))
            | (User.email.ilike(search_pattern))
        )

    # Filter by role
    if role and role != "ALL":
        query = query.filter(
            User.role == role
        )

    return (
        query
        .order_by(User.id)
        .all()
    )


# =========================
# UPDATE USER ROLE
# ADMIN ONLY
# =========================

@router.patch(
    "/{user_id}/role",
    response_model=UserResponse,
)
def update_user_role(
    user_id: int,
    user_data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    require_admin(current_user)

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Admin cannot change his own role
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot change your own role",
        )

    user.role = user_data.role

    db.commit()
    db.refresh(user)

    return user


# =========================
# DELETE USER
# ADMIN ONLY
# =========================

@router.delete(
    "/{user_id}",
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    require_admin(current_user)

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Admin cannot delete himself
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    # Check if user has reported bugs
    reported_bugs = (
        db.query(Bug)
        .filter(
            Bug.reporter_id == user.id
        )
        .count()
    )

    if reported_bugs > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This user cannot be deleted "
                "because they have reported bugs"
            ),
        )

    # Remove user from assigned bugs
    assigned_bugs = (
        db.query(Bug)
        .filter(
            Bug.assigned_to == user.id
        )
        .all()
    )

    for bug in assigned_bugs:
        bug.assigned_to = None

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# =========================
# REGISTER
# =========================

@router.post(
    "/register",
    response_model=UserResponse,
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# =========================
# LOGIN
# =========================

@router.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        user_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
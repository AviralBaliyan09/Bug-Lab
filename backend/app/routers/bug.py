from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.permissions import (
    require_admin,
    require_admin_or_developer,
    require_assigned_developer_or_admin,
)
from app.database.dependencies import get_db
from app.models.bug import Bug
from app.models.user import User
from app.schemas.bug import (
    BugAssign,
    BugCreate,
    BugPriorityUpdate,
    BugResponse,
    BugStatusUpdate,
    BugUpdate,
)


router = APIRouter(
    prefix="/bugs",
    tags=["Bugs"],
)


# ==================================================
# CREATE BUG
# ADMIN + DEVELOPER
# ==================================================

@router.post(
    "/",
    response_model=BugResponse,
)
def create_bug(
    bug_data: BugCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_admin_or_developer(current_user)

    bug = Bug(
        title=bug_data.title,
        description=bug_data.description,
        priority=bug_data.priority,
        reporter_id=current_user.id,
    )

    db.add(bug)
    db.commit()
    db.refresh(bug)

    return bug


# ==================================================
# GET ALL BUGS + SEARCH + FILTER
# ALL AUTHENTICATED USERS
# ==================================================

@router.get(
    "/",
    response_model=list[BugResponse],
)
def get_bugs(
    status: str | None = None,
    priority: str | None = None,
    assigned_to: int | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Bug)

    # Filter by status
    if status:
        query = query.filter(
            Bug.status == status
        )

    # Filter by priority
    if priority:
        query = query.filter(
            Bug.priority == priority
        )

    # Filter by assigned user
    if assigned_to:
        query = query.filter(
            Bug.assigned_to == assigned_to
        )

    # Search by title or description
    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            (Bug.title.ilike(search_pattern))
            | (
                Bug.description.ilike(
                    search_pattern
                )
            )
        )

    bugs = (
        query
        .order_by(
            Bug.created_at.desc()
        )
        .all()
    )

    return bugs


# ==================================================
# GET SINGLE BUG
# ALL AUTHENTICATED USERS
# ==================================================

@router.get(
    "/{bug_id}",
    response_model=BugResponse,
)
def get_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    return bug


# ==================================================
# UPDATE BUG
# ADMIN ONLY
# ==================================================

@router.put(
    "/{bug_id}",
    response_model=BugResponse,
)
def update_bug(
    bug_id: int,
    bug_data: BugUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    require_admin(current_user)

    update_data = bug_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            bug,
            field,
            value,
        )

    db.commit()
    db.refresh(bug)

    return bug


# ==================================================
# DELETE BUG
# ADMIN ONLY
# ==================================================

@router.delete(
    "/{bug_id}"
)
def delete_bug(
    bug_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    require_admin(current_user)

    db.delete(bug)
    db.commit()

    return {
        "message": "Bug deleted successfully"
    }


# ==================================================
# ASSIGN BUG
# ADMIN ONLY
# ==================================================

@router.patch(
    "/{bug_id}/assign",
    response_model=BugResponse,
)
def assign_bug(
    bug_id: int,
    assign_data: BugAssign,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    require_admin(current_user)

    # Check whether assigned user exists
    if assign_data.assigned_to is not None:
        assigned_user = (
            db.query(User)
            .filter(
                User.id == assign_data.assigned_to
            )
            .first()
        )

        if assigned_user is None:
            raise HTTPException(
                status_code=404,
                detail="Assigned user not found",
            )

    # Assign or unassign bug
    bug.assigned_to = assign_data.assigned_to

    db.commit()
    db.refresh(bug)

    return bug


# ==================================================
# UPDATE BUG STATUS
# ADMIN OR ASSIGNED DEVELOPER
# ==================================================

@router.patch(
    "/{bug_id}/status",
    response_model=BugResponse,
)
def update_bug_status(
    bug_id: int,
    status_data: BugStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    require_assigned_developer_or_admin(
        current_user,
        bug.assigned_to,
    )

    bug.status = status_data.status

    db.commit()
    db.refresh(bug)

    return bug


# ==================================================
# UPDATE BUG PRIORITY
# ADMIN OR ASSIGNED DEVELOPER
# ==================================================

@router.patch(
    "/{bug_id}/priority",
    response_model=BugResponse,
)
def update_bug_priority(
    bug_id: int,
    priority_data: BugPriorityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bug = (
        db.query(Bug)
        .filter(Bug.id == bug_id)
        .first()
    )

    if bug is None:
        raise HTTPException(
            status_code=404,
            detail="Bug not found",
        )

    require_assigned_developer_or_admin(
        current_user,
        bug.assigned_to,
    )

    bug.priority = priority_data.priority

    db.commit()
    db.refresh(bug)

    return bug
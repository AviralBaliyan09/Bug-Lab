from enum import Enum

from pydantic import BaseModel


class BugStatus(str, Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class BugPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class BugCreate(BaseModel):
    title: str
    description: str
    priority: BugPriority = BugPriority.MEDIUM


class BugUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: BugStatus | None = None
    priority: BugPriority | None = None


class BugAssign(BaseModel):
    assigned_to: int | None = None


class BugStatusUpdate(BaseModel):
    status: BugStatus


class BugPriorityUpdate(BaseModel):
    priority: BugPriority


class BugResponse(BaseModel):
    id: int
    title: str
    description: str
    status: BugStatus
    priority: BugPriority
    reporter_id: int
    assigned_to: int | None = None

    model_config = {
        "from_attributes": True,
    }

class BugFilter(BaseModel):
    status: BugStatus | None = None
    priority: BugPriority | None = None
    assigned_to: int | None = None
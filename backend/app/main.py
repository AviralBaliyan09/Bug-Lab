from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.user import router as user_router
from app.routers.bug import router as bug_router


app = FastAPI(
    title="Bug Tracker API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(bug_router)


@app.get("/")
def root():
    return {
        "message": "Bug Tracker API Running"
    }
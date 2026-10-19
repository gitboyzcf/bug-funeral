from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import autopsies, bugs, stats
from app.database import init_db

app = FastAPI(title="Bug Funeral API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(autopsies.router)
app.include_router(bugs.router)
app.include_router(stats.router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/v1/health")
def health():
    return {"Status": "ok", "Service": "bug-funeral"}
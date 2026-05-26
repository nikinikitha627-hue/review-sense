"""
ReviewSense Backend — AI-Powered Product Review Analyzer
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import create_tables
from api import health, analyze, compare, history, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and Shutdown Events"""
    # Startup
    print("🚀 ReviewSense Backend Starting...")
    await create_tables()
    print("✅ Database tables ready")
    yield
    # Shutdown
    print("🛑 ReviewSense Backend Shutting Down...")


app = FastAPI(
    title="ReviewSense",
    description="AI-Powered Product Review Analyzer - Extract deep insights from customer reviews instantly",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    contact={
        "name": "ReviewSense Team",
        "url": "https://reviewsense.app",
    },
)

# ── CORS Middleware ───────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(analyze.router, prefix="/analyze", tags=["analysis"])
app.include_router(compare.router, prefix="/compare", tags=["comparison"])
app.include_router(history.router, prefix="/history", tags=["history"])


@app.get("/")
async def root():
    return {
        "app": "ReviewSense",
        "status": "operational",
        "version": "1.0.0",
        "description": "AI-Powered Product Review Analyzer",
        "docs": "/docs",
        "message": "Drop your product reviews and get powerful insights ✨"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ReviewSense API",
        "timestamp": "auto"
    }

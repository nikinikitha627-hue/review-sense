from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok", "service": "antigravity-backend"}


@router.get("/ping")
async def ping():
    return "pong"

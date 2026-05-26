"""
Scaffold route — AI generates a full feature (API route + React page)
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from core.security import get_current_user

router = APIRouter()


class ScaffoldRequest(BaseModel):
    feature: str
    style: str = "tailwind"
    auth_required: bool = True


class ScaffoldResult(BaseModel):
    feature: str
    backend_route: str
    frontend_page: str
    pydantic_schema: str
    react_hook: str


@router.post("/", response_model=ScaffoldResult)
async def scaffold_feature(req: ScaffoldRequest, _user=Depends(get_current_user)):
    """
    Generate a full feature scaffold via Claude:
    - FastAPI route with Pydantic schemas
    - React page component
    - Custom API hook
    """
    try:
        from antigravity.engine import PipelineEngine
        engine = PipelineEngine()
        result = await engine.run(
            "scaffold",
            {"feature": req.feature, "style": req.style, "auth_required": req.auth_required},
            {},
        )
        return ScaffoldResult(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

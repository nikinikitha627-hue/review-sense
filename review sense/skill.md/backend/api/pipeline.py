"""
Pipeline API — trigger Antigravity pipelines over HTTP
"""

import asyncio
from typing import Any, Dict, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel

from core.security import get_current_user

router = APIRouter()

AVAILABLE_PIPELINES = {
    "discover": "Enumerate targets / CVE match",
    "report": "Generate structured .docx / .pdf reports",
    "docgen": "IEEE / academic document generation",
    "analyze": "Feed data → Claude → structured JSON output",
    "scaffold": "Generate new API route + frontend page pair",
}


class PipelineRequest(BaseModel):
    pipeline: str
    input: Optional[Dict[str, Any]] = None
    options: Optional[Dict[str, Any]] = None


class PipelineResponse(BaseModel):
    pipeline: str
    status: str
    job_id: str
    message: str


# ── In-memory job store (replace with Redis/DB for prod) ──────────
_jobs: Dict[str, Dict] = {}


@router.get("/")
async def list_pipelines():
    """List all available Antigravity pipelines."""
    return {"pipelines": AVAILABLE_PIPELINES}


@router.post("/run", response_model=PipelineResponse)
async def run_pipeline(
    req: PipelineRequest,
    background_tasks: BackgroundTasks,
    _user=Depends(get_current_user),
):
    """Trigger an Antigravity pipeline asynchronously."""
    if req.pipeline not in AVAILABLE_PIPELINES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown pipeline: {req.pipeline!r}. Available: {list(AVAILABLE_PIPELINES)}",
        )

    import uuid
    job_id = str(uuid.uuid4())[:8]
    _jobs[job_id] = {"status": "queued", "pipeline": req.pipeline, "result": None}

    background_tasks.add_task(_execute_pipeline, job_id, req)

    return PipelineResponse(
        pipeline=req.pipeline,
        status="queued",
        job_id=job_id,
        message=f"Pipeline '{req.pipeline}' queued as job {job_id}",
    )


@router.get("/status/{job_id}")
async def job_status(job_id: str, _user=Depends(get_current_user)):
    """Poll pipeline job status."""
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return job


async def _execute_pipeline(job_id: str, req: PipelineRequest):
    """Background task: execute pipeline via antigravity engine."""
    _jobs[job_id]["status"] = "running"
    try:
        # Import here to avoid circular at startup
        from antigravity.engine import PipelineEngine
        engine = PipelineEngine()
        result = await engine.run(req.pipeline, req.input or {}, req.options or {})
        _jobs[job_id]["status"] = "done"
        _jobs[job_id]["result"] = result
    except Exception as e:
        _jobs[job_id]["status"] = "error"
        _jobs[job_id]["error"] = str(e)

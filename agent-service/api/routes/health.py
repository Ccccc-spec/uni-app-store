from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "ok", "service": "agent-service", "timestamp": datetime.utcnow().isoformat()}

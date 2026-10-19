from fastapi import APIRouter

from app.coroner import conduct_autopsy
from app.schemas import AutopsyReport, AutopsyRequest

router = APIRouter(prefix="/api/v1/autopsies", tags=["autopsies"])


@router.post("", response_model=AutopsyReport)
def create_autopsy(req: AutopsyRequest):
    return conduct_autopsy(req.Stack)
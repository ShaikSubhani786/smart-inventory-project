from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db

from app.schemas.dashboard import DashboardResponse

from app.crud.dashboard import get_dashboard_data

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/",
    response_model=DashboardResponse
)
def dashboard(
    db: Session = Depends(get_db)
):
    return get_dashboard_data(db)
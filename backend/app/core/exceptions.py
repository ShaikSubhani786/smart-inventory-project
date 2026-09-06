from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

from app.core.logger import logger


async def http_exception_handler(
    request: Request,
    exc: HTTPException
):
    logger.warning(
        f"{request.method} {request.url} "
        f"- {exc.status_code} - {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "status_code": exc.status_code,
            "message": exc.detail
        },
        headers=exc.headers
    )


async def global_exception_handler(
    request: Request,
    exc: Exception
):
    logger.exception(
        f"Unhandled error: "
        f"{request.method} {request.url}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "status_code": 500,
            "message": "Internal server error"
        }
    )
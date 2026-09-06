from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.exceptions import (
    http_exception_handler,
    global_exception_handler
)

from app.api.v1.auth import router as auth_router
from app.api.v1.category import router as category_router
from app.api.v1.products import router as product_router
from app.api.v1.stock_transaction import router as stock_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.supplier import router as supplier_router
from app.api.v1.sales import router as sales_router
from app.api.v1.purchase import router as purchase_router
from app.api.v1.reports import router as reports_router


app = FastAPI(
    title="Smart Inventory Management System"
)


# Frontend URL from environment variable
frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Exception handlers
app.add_exception_handler(
    HTTPException,
    http_exception_handler
)

app.add_exception_handler(
    Exception,
    global_exception_handler
)


# Serve uploaded files
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# Routers
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(stock_router)
app.include_router(dashboard_router)
app.include_router(supplier_router)
app.include_router(sales_router)
app.include_router(purchase_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {
        "message": "Smart Inventory API"
    }
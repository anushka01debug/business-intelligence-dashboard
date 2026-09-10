from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dashboard import router as dashboard_router
from routes.customers import router as customers_router
from routes.products import router as products_router
from routes.orders import router as orders_router

app = FastAPI(
    title="Business Performance Intelligence System API",
    description="Backend REST API for business performance analytics, reporting, and management",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard_router)
app.include_router(customers_router)
app.include_router(products_router)
app.include_router(orders_router)


@app.get("/")
def home():
    return {
        "status": "online",
        "system": "Business Performance Intelligence System API",
        "version": "2.0.0"
    }
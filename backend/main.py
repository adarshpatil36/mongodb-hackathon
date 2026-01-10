# FastAPI application entry point
from fastapi import FastAPI
from contextlib import asynccontextmanager
import logging
from database import connect_to_mongo, close_mongo_connection
from api.routes import patients, calls, patient_state, webhooks
from workers.scheduler import start_scheduler, stop_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("Starting up...")
    await connect_to_mongo()
    start_scheduler()
    yield
    # Shutdown
    logger.info("Shutting down...")
    stop_scheduler()
    await close_mongo_connection()

app = FastAPI(
    title="Tether API",
    description="API for Tether",
    version="1.0.0",
    lifespan=lifespan
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Tether API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Include routers
app.include_router(patients.router)
app.include_router(calls.router)
app.include_router(patient_state.router)
app.include_router(webhooks.router)
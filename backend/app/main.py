from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.services.chatbot import CustomerServiceChatbot
from app.models.chat import HealthResponse
from app.core.config import settings

# Initialize FastAPI app with metadata
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCREPTION,
    version=settings.VERSION
)
# Apply CORS middleware (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  
    allow_credentials=True,  
    allow_methods=["*"],     
    allow_headers=["*"],     
)
# Include all API routes from the router
app.include_router(router)

# Startup event: Initialize chatbot once when server starts
@app.get("/", response_model=HealthResponse)
async def root():
    """
    Useful for monitoring or checking server status.
    """
    return HealthResponse(
        status="healthy",
        message="Customer Service Chatbot API is running"
    )


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.services.chatbot import initialize_chatbot

# FastAPI app initialization
app = FastAPI(
    title="Customer Service Chatbot API",
    description="AI-powered customer service chatbot using RAG",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

# Initialize chatbot on startup
@app.on_event("startup")
async def startup_event():
    success = initialize_chatbot()
    if not success:
        print("Failed to initialize chatbot. Some endpoints may not work.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
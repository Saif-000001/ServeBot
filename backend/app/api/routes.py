from fastapi import APIRouter, HTTPException
from app.models.chat import ChatMessage, ChatResponse, HealthResponse
from app.services.chatbot import get_query_engine, initialize_chatbot

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="healthy",
        message="Customer Service Chatbot API is running"
    )

@router.get("/health", response_model=HealthResponse)
async def health_check():
    query_engine = get_query_engine()
    status = "healthy" if query_engine is not None else "unhealthy"
    message = "Chatbot is ready" if query_engine is not None else "Chatbot is not initialized"
    
    return HealthResponse(status=status, message=message)

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    query_engine = get_query_engine()
    
    if query_engine is None:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not initialized. Please check the server logs."
        )
    
    try:
        # Query the chatbot
        response = query_engine.query(message.message)
        
        # Extract source information if available
        sources = []
        if hasattr(response, 'source_nodes'):
            for node in response.source_nodes:
                if hasattr(node, 'metadata') and 'file_name' in node.metadata:
                    sources.append(node.metadata['file_name'])
        
        return ChatResponse(
            response=response.response,
            sources=list(set(sources))  # Remove duplicates
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

@router.post("/reinitialize")
async def reinitialize_chatbot():
    """Endpoint to reinitialize the chatbot (useful for updates)"""
    success = initialize_chatbot()
    if success:
        return {"status": "success", "message": "Chatbot reinitialized successfully"}
    else:
        raise HTTPException(
            status_code=500,
            detail="Failed to reinitialize chatbot"
        )
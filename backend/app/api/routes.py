from fastapi import APIRouter, HTTPException
from app.models.chat import ChatMessage, ChatResponse, HealthResponse
from app.services.chatbot import CustomerServiceChatbot

# Create a new API router for chatbot-related endpoints
router = APIRouter()
# Initialize a singleton instance of the chatbot service
chatbot = CustomerServiceChatbot()

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    # Validate that the message is not empty 
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    # Get the chatbot's response for the given message
    response = chatbot.get_answer(message.message)
    # Return the response wrapped in the ChatResponse model
    return ChatResponse(
        response=str(response)
    )

@router.post("/reinitialize")
async def reinitialize_chatbot():
    try:
        # Rebuild or reload the chatbot's vector store
        chatbot.initialize_vector_store()
        return {"status": "success", "message": "Chatbot reinitialized successfully"}
    except Exception as e:
        # Return an error message if reinitialization fails
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reinitialize chatbot: {str(e)}"
        )

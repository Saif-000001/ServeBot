from pydantic import BaseModel
from typing import List, Optional

# Model representing a user message sent to the chatbot
class ChatMessage(BaseModel):
    message: str

# Model representing the chatbot's response
class ChatResponse(BaseModel):
    response: str

# Model representing the API health check response
class HealthResponse(BaseModel):
    status: str
    message: str

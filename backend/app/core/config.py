import os
from dotenv import load_dotenv
from typing import List

# Load environment variables
load_dotenv()

class Settings:
    # Project Info
    PROJECT_NAME: str = "Customer Service Chatbot API"
    DESCREPTION: str = "AI-powered customer service chatbot using Retrieval-Augmented Generation (RAG)"
    VERSION: str = "1.0.0"

    # CORS (Cross-Origin Resource Sharing)
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",   # React + Vite
        "http://localhost:3000",   # React CRA
        "http://localhost:8000"    # FastAPI docs
    ]

    # Qdrant Configuration
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str | None = os.getenv("QDRANT_API_KEY")
    QDRANT_INDEX_NAME: str = "customer_service-chatbot"

    # Embedding Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384  # Embedding vector size

    # Google API Configuration
    GOOGLE_API_KEY: str | None = os.getenv("GOOGLE_API_KEY")

    # Prompt Engineering
    PROMPT: str = (
        "You are a helpful e-commerce customer service assistant.\n\n"
        "Use the following context to answer customer questions about products, "
        "orders, account management, and customer service procedures.\n\n"
        
        "IMPORTANT GUIDELINES:\n"
        "- Provide direct, specific answers based on the context.\n"
        "- If information isn't in the context, respond with: "
        "'I don't have that specific information. Please contact customer support for assistance.'\n"
        "- Be concise but complete in your responses.\n"
        "- Use a friendly, professional tone.\n"
        "- Include necessary emojis so users better understand their situation. "
        "Respond with relevant service-context emojis.\n\n"
        
        "Context information:\n"
        "---------------------\n"
        "{context_str}\n"
        "---------------------\n"
        "Question: {query_str}\n"
        "Answer:"
    )

    # Chat Model Configuration
    CHAT_MODEL: str = "models/gemini-1.5-flash"
    TEMPERATURE: float = 0.0

    # Document Processing
    DATA_DIR: str = "data"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 20

    # Retrieval Settings
    SIMILARITY_TOP_K: int = 3

# Instantiate settings object for global use
settings = Settings()

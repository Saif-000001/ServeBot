import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # Qdrant configuration
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY")
    
    # Google API configuration
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    
    # Collection settings
    COLLECTION_NAME: str = "customer_service-chatbot"
    EMBEDDING_DIMENSION: int = 384
    
    # Document processing
    DATA_DIR: str = "data"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 20
    
    # Retrieval settings
    SIMILARITY_TOP_K: int = 3

settings = Settings()
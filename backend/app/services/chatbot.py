import qdrant_client
from fastapi import HTTPException
from llama_index.core import VectorStoreIndex, Settings, StorageContext
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.llms.gemini import Gemini
from llama_index.core import get_response_synthesizer
from llama_index.core.prompts import PromptTemplate
from llama_index.core.query_engine import RetrieverQueryEngine

from app.core.config import settings
from app.utils.documents import load_pdf_documents

class CustomerServiceChatbot:
    """
    CustomerServiceChatbot handles:
    - Loading documents
    - Building embeddings
    - Connecting to Qdrant vector DB
    - Creating a Retrieval-Augmented Generation (RAG) query pipeline
    - Serving user queries via a query engine
    """
    def __init__(self):
        """
        Initialize the chatbot:
        - Load embeddings model
        - Setup Qdrant vector database connection
        - Build RAG chain (Retriever + LLM Synthesizer)
        """
        self.index = None
        self.query_engine = None
        # Initialize embedding model from HuggingFace
        self.embeddings = HuggingFaceEmbedding(
            model_name=settings.EMBEDDING_MODEL
        )
        Settings.embed_model = self.embeddings
        # Connect to Qdrant and build vector store
        self.setup_qdrant()
        # Initialize RAG pipeline for question answering
        self.setup_rag_chain()

    def setup_qdrant(self):
        """
        Configure the Qdrant vector database:
        - Connect to Qdrant with or without API key
        - Create a QdrantVectorStore and attach embeddings
        - Prepare a StorageContext for LlamaIndex
        """
        if settings.QDRANT_API_KEY:
            client = qdrant_client.QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
            )
        else:
            client = qdrant_client.QdrantClient(url=settings.QDRANT_URL)
        # Attach the vector store to the client
        self.vector_store = QdrantVectorStore(
            client=client,
            collection_name=settings.QDRANT_INDEX_NAME,
            dimension=settings.EMBEDDING_DIMENSION
        )
        # Create storage context for LlamaIndex operations
        self.storage_context = StorageContext.from_defaults(
            vector_store=self.vector_store
        )

    def setup_rag_chain(self):
        """
        Build the Retrieval-Augmented Generation (RAG) pipeline:
        - Load or create VectorStoreIndex
        - Configure retriever
        - Set up Gemini as LLM
        - Build response synthesizer
        - Combine retriever + synthesizer in query engine
        """
        # Initialize the LLM (Gemini) for answer generation
        Settings.llm = Gemini(
            model=settings.CHAT_MODEL,
            api_key=settings.GOOGLE_API_KEY,
            temperature=settings.TEMPERATURE
        )
        try:
            # Attempt to load an existing index from vector store
            self.index = VectorStoreIndex.from_vector_store(
                vector_store=self.vector_store,
                storage_context=self.storage_context
            )
        except Exception as e:
            # If index not found, notify that a new index must be built
            raise HTTPException(
                status_code=500,
                detail=f"Index not found, build a new index: {str(e)}"
            )
        # Convert the index into a retriever for searching similar docs
        retriever = self.index.as_retriever(
            similarity_top_k=settings.SIMILARITY_TOP_K
        )
        # Set up response synthesizer with a compact QA template
        response_synthesizer = get_response_synthesizer(
            response_mode="compact",
            text_qa_template=PromptTemplate(settings.PROMPT),
            streaming=False
        )
        # Combine retriever and synthesizer in a query engine
        self.query_engine = RetrieverQueryEngine(
            retriever=retriever,
            response_synthesizer=response_synthesizer,
        )

    def initialize_vector_store(self, data_path: str = settings.DATA_DIR):
        """
        Load documents, chunk them, and populate the vector store:
        - Load PDF documents from the specified directory
        - Split text into chunks for better embedding
        - Insert chunks into VectorStoreIndex (Qdrant)
        """
        try:
            # Load PDF documents from disk
            documents = load_pdf_documents(data_path)
            # Configure chunking (size and overlap)
            node_parser = SentenceSplitter(
                chunk_size=settings.CHUNK_SIZE,
                chunk_overlap=settings.CHUNK_OVERLAP
            )
            Settings.node_parser = node_parser
            # Build the index from documents
            self.index = VectorStoreIndex.from_documents(
                documents,
                storage_context=self.storage_context,
                show_progress=True
            )
            return True
        except Exception as e:
            # Raise HTTP error if initialization fails
            raise HTTPException(
                status_code=500,
                detail=f"Error initializing vector store: {str(e)}"
            )

    def get_answer(self, question: str):
        """
        Query the chatbot and return an answer:
        - Uses the RAG pipeline (retriever + LLM synthesizer)
        - Returns the final structured response
        """
        try:
            response = self.query_engine.query(question)
            return response
        except Exception as e:
            # Raise HTTP error if query fails
            raise HTTPException(
                status_code=500,
                detail=f"Error processing question: {str(e)}"
            )

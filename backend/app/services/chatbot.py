import qdrant_client
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

# Global variables
query_engine = None
index = None

def initialize_chatbot():
    """Initialize the chatbot components"""
    global query_engine, index
    
    try:
        print("Initializing chatbot...")
        
        # Load documents
        documents = load_pdf_documents(settings.DATA_DIR)
        print(f"Loaded {len(documents)} documents")

        # Set up text splitter
        node_parser = SentenceSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP
        )
        Settings.node_parser = node_parser

        # Set up embeddings
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        # Set up Qdrant vector store
        if settings.QDRANT_API_KEY:
            client = qdrant_client.QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
            )
        else:
            client = qdrant_client.QdrantClient(url=settings.QDRANT_URL)

        vector_store = QdrantVectorStore(
            client=client,
            collection_name=settings.COLLECTION_NAME,
            dimension=settings.EMBEDDING_DIMENSION
        )

        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Create or load index
        print("Creating/loading index...")
        try:
            # Try to load existing index
            index = VectorStoreIndex.from_vector_store(
                vector_store=vector_store,
                storage_context=storage_context
            )
            print("Loaded existing index from Qdrant")
        except:
            # Create new index if loading fails
            index = VectorStoreIndex.from_documents(
                documents,
                storage_context=storage_context,
                show_progress=True
            )
            print("Created new index")

        # Set up LLM
        if not settings.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY environment variable is not set")
        
        Settings.llm = Gemini(
            model="models/gemini-1.5-flash",
            api_key=settings.GOOGLE_API_KEY,
            temperature=0
        )

        # Create retriever
        retriever = index.as_retriever(similarity_top_k=settings.SIMILARITY_TOP_K)

        # Define system prompt
        system_prompt_template = (
            "You are a helpful e-commerce customer service assistant. "
            "Use the following context to answer customer questions about products, "
            "orders, account management, and customer service procedures.\n\n"
            "IMPORTANT GUIDELINES:\n"
            "- Give direct, specific answers based on the context\n"
            "- If information isn't in the context, say 'I don't have that specific information. Please contact customer support for assistance.'\n"
            "- Be concise but complete in your responses\n"
            "- Use a friendly, professional tone\n\n"
            "Context information:\n"
            "---------------------\n"
            "{context_str}\n"
            "---------------------\n"
            "Question: {query_str}\n"
            "Answer:"
        )

        # Create response synthesizer
        response_synthesizer = get_response_synthesizer(
            response_mode="compact",
            text_qa_template=PromptTemplate(system_prompt_template),
            streaming=False
        )

        # Create query engine
        query_engine = RetrieverQueryEngine(
            retriever=retriever,
            response_synthesizer=response_synthesizer,
        )

        print("Chatbot initialization complete!")
        return True

    except Exception as e:
        print(f"Error initializing chatbot: {str(e)}")
        return False

def get_query_engine():
    """Get the global query engine instance"""
    return query_engine

def get_index():
    """Get the global index instance"""
    return index
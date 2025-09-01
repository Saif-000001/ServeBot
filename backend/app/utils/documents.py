from llama_index.core import SimpleDirectoryReader
from pathlib import Path

def load_pdf_documents(data_dir: str):
    """Load PDF documents from a directory."""
    if not Path(data_dir).exists():
        raise FileNotFoundError(f"Directory {data_dir} does not exist")
    
    loader = SimpleDirectoryReader(
        input_dir=data_dir,
        required_exts=[".pdf"]
    )
    documents = loader.load_data()
    return documents

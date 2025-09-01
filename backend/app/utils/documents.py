from llama_index.core import SimpleDirectoryReader
from pathlib import Path

def load_pdf_documents(data_dir: str):
    # Check if the specified directory exists
    if not Path(data_dir).exists():
        raise FileNotFoundError(f"Directory {data_dir} does not exist")
    # Initialize the document loader for PDFs only
    loader = SimpleDirectoryReader(
        input_dir=data_dir,
        required_exts=[".pdf"]  # Only load files with .pdf extension
    )
    # Load and return all documents in the directory
    documents = loader.load_data()
    return documents

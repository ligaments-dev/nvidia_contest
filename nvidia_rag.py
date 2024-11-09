import os
import logging
from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.background import BackgroundTasks
from pydantic import BaseModel
from llama_index.core import Settings, VectorStoreIndex, StorageContext
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.llms.nvidia import NVIDIA
from document_processors import load_multimodal_data, load_data_from_directory
from utils import set_environment_variables

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI()

# CORS middleware for handling cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize settings
def initialize_settings():
    Settings.embed_model = NVIDIAEmbedding(model="nvidia/nv-embedqa-e5-v5", truncate="END")
    Settings.llm = NVIDIA(model="meta/llama-3.1-70b-instruct")
    Settings.text_splitter = SentenceSplitter(chunk_size=600)
    logger.info("Settings initialized.")

initialize_settings()

# Chroma vector store client setup
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Helper function to create an index
def create_index(documents):
    try:
        chroma_collection = chroma_client.create_collection("quickstart")
        logger.info("Chroma collection created.")
    except:
        chroma_client.delete_collection("quickstart")
        chroma_collection = chroma_client.create_collection("quickstart")
        logger.info("Existing Chroma collection deleted and recreated.")
    
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    return VectorStoreIndex.from_documents(documents, storage_context=storage_context)

# Endpoint for uploading files or directory path
class DirectoryPathRequest(BaseModel):
    directory_path: str

@app.post("/upload-files")
async def upload_files(files: list[UploadFile] = File(...)):
    """Endpoint for uploading multiple files."""
    global index
    documents = load_multimodal_data(files)
    index = create_index(documents)
    logger.info("Files processed and index created!")
    return {"message": "Files processed and index created successfully"}

@app.post("/upload-directory")
async def upload_directory(data: DirectoryPathRequest):
    """Endpoint for processing a directory path."""
    global index
    directory_path = data.directory_path
    if not os.path.isdir(directory_path):
        raise HTTPException(status_code=400, detail="Invalid directory path")
    documents = load_data_from_directory(directory_path)
    index = create_index(documents)
    logger.info("Directory processed and index created!")
    return {"message": "Directory processed and index created successfully"}

# WebSocket endpoint for chat interaction
@app.websocket("/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    if 'index' not in globals():
        await websocket.send_text("Index not available. Please upload files or directory first.")
        await websocket.close()
        return

    query_engine = index.as_chat_engine(similarity_top_k=20, streaming=True)
    history = []
    
    try:
        while True:
            data = await websocket.receive_text()
            history.append({"role": "user", "content": data})
            response = query_engine.chat(data)
            print(response)
            await websocket.send_text(str(response))
            history.append({"role": "assistant", "content": response})
            logger.info(f"User query processed: {data}")

    except Exception as e:
        logger.error(f"Error during WebSocket communication: {str(e)}")
        await websocket.close()

# HTML for testing the WebSocket chat endpoint
@app.get("/")
async def get():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Chat with RAG Model</title>
    </head>
    <body>
        <h1>RAG Model Chat</h1>
        <form id="messageForm">
            <input type="text" id="messageText" autocomplete="off"/>
            <button type="submit">Send</button>
        </form>
        <ul id="messages">
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/chat");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages');
                var message = document.createElement('li');
                var content = document.createTextNode(event.data);
                message.appendChild(content);
                messages.appendChild(message);
            };
            document.getElementById('messageForm').onsubmit = function(event) {
                event.preventDefault();
                var input = document.getElementById("messageText");
                ws.send(input.value);
                input.value = '';
            };
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)
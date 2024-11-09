import os
import streamlit as st
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.node_parser import SentenceSplitter
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
from llama_index.embeddings.nvidia import NVIDIAEmbedding
from llama_index.llms.nvidia import NVIDIA

from document_processors import load_multimodal_data, load_data_from_directory
from utils import set_environment_variables
import logging

from nemoguardrails import LLMRails, RailsConfig


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up the page configuration
st.set_page_config(layout="wide")

# Initialize settings
def initialize_settings():
    Settings.embed_model = NVIDIAEmbedding(model="nvidia/nv-embedqa-e5-v5", truncate="END")
    Settings.llm = NVIDIA(model="meta/llama-3.1-70b-instruct")
    Settings.text_splitter = SentenceSplitter(chunk_size=600)
    config = RailsConfig.from_path('config')
    rails = LLMRails(config=config, llm=Settings.llm, embedding_model=Settings.embed_model)
    rails.generate_async(prompt="<user message>")
    logger.info("Settings initialized.")

# Create index from documents
def create_index(documents):
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
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

# Main function to run the Streamlit app
def main():
    set_environment_variables()
    initialize_settings()

    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.title("Multimodal RAG")
        
        input_method = st.radio("Choose input method:", ("Upload Files", "Enter Directory Path"))
        
        if input_method == "Upload Files":
            uploaded_files = st.file_uploader("Drag and drop files here", accept_multiple_files=True)
            if uploaded_files and st.button("Process Files"):
                with st.spinner("Processing files..."):
                    documents = load_multimodal_data(uploaded_files)
                    st.session_state['index'] = create_index(documents)
                    st.session_state['history'] = []
                    st.success("Files processed and index created!")
                    logger.info("Files uploaded and processed successfully.")
        else:
            directory_path = st.text_input("Enter directory path:")
            if directory_path and st.button("Process Directory"):
                if os.path.isdir(directory_path):
                    with st.spinner("Processing directory..."):
                        documents = load_data_from_directory(directory_path)
                        st.session_state['index'] = create_index(documents)
                        st.session_state['history'] = []
                        st.success("Directory processed and index created!")
                        logger.info("Directory processed successfully.")
                else:
                    st.error("Invalid directory path. Please enter a valid path.")
                    logger.error("Invalid directory path entered.")

    with col2:
        if 'index' in st.session_state:
            st.title("Chat")
            if 'history' not in st.session_state:
                st.session_state['history'] = []
            
            query_engine = st.session_state['index'].as_chat_engine(similarity_top_k=20, streaming=True)

            user_input = st.chat_input("Enter your query:")

            # Display chat messages
            chat_container = st.container()
            with chat_container:
                for message in st.session_state['history']:
                    with st.chat_message(message["role"]):
                        st.markdown(message["content"])

            if user_input:
                with st.chat_message("user"):
                    st.markdown(user_input)
                st.session_state['history'].append({"role": "user", "content": user_input})
                
                with st.chat_message("assistant"):
                    message_placeholder = st.empty()
                    full_response = ""
                    response = query_engine.stream_chat(user_input)
                    for token in response.response_gen:
                        full_response += token
                        message_placeholder.markdown(full_response + "▌")
                    message_placeholder.markdown(full_response)
                st.session_state['history'].append({"role": "assistant", "content": full_response})
                logger.info(f"User query processed: {user_input}")

            # Add a clear button
            if st.button("Clear Chat"):
                st.session_state['history'] = []
                st.rerun()
                logger.info("Chat history cleared.")

if __name__ == "__main__":
    main()
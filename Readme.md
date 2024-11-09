# NVIDIA RAG Streamlit Application

This repository contains a Streamlit-based application that leverages NVIDIA RAG (Retrieval-Augmented Generation) for enhanced document processing. The app processes multiple file types (PDF, PPT, Images, and text) and provides rich metadata and information extraction.

## Features
- Extracts text, tables, and images from PDFs.
- Processes PowerPoint presentations and converts them to images.
- Supports various file formats including PDF, PPT, and images.
- Automatically extracts metadata like captions and descriptions for images and tables.
- Provides a streamlined UI to interact with processed documents.

## Installation

To run this application locally, follow these steps:

### Prerequisites
- Docker (for containerized deployment)
- Python 3.11.9 or higher (for local development)

### Setup with Docker
1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/nvidia_rag_streamlit.git
   cd nvidia_rag_streamlit

2. Build the Docker image:
    ```bash
    docker build -t nvidia_rag_app .
3. Run the Docker container:
    docker run -p 8697:8697 nvidia_rag_app
4. Access the Streamlit app by navigating to http://localhost:8697 in your web browser.

### Setup without Docker (local installation)
1. Clone this repository:
    ```bash
    git clone https://github.com/ligaments-dev/nvidia_contest.git
    cd nvidia_contest
2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # For Linux/MacOS
    venv\Scripts\activate     # For Windows
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
4. Run the Streamlit app:
    ```bash
    streamlit run nvidia_rag.py --server.port=8697
5. Open your web browser and go to http://localhost:8697 to access the app.
# NVIDIA Developer Contest

The **Telecom Field Assistant Bot** is an intelligent, conversational assistant specifically designed to support field technicians working in the telecommunications industry. Leveraging a powerful NLP model, the bot provides accurate, real-time assistance for a range of on-site challenges, helping technicians troubleshoot equipment, understand telecom protocols, and adhere to industry standards. This application is particularly suited for remote and on-the-go access, empowering technicians to get answers and guidance in the field without delays.

### Key Features
- **Troubleshooting Assistance:** Provides detailed instructions for resolving common telecom equipment issues and configuration steps, such as resetting network settings, addressing signal disruptions, and diagnosing connectivity problems.
- **Field Protocol Guidance:** Delivers real-time information on standard operating procedures for fieldwork, such as safety protocols, reporting requirements, and escalation procedures.
- **Resource Access:** Offers instant access to technical documentation, installation guides, and industry best practices, tailored to various types of telecom equipment and setups.
- **Knowledge Consistency:** Answers technician queries with reliable and up-to-date information, minimizing the need for consulting multiple sources or manuals during critical field tasks.

### Use Cases
1. **On-Site Equipment Troubleshooting:** Field technicians can ask the bot how to resolve issues with routers, antennas, or signal amplifiers. For instance, they might inquire about resetting devices, testing signal strength, or re-establishing network connections.
  
2. **Protocol and Reporting Support:** The bot can guide technicians through standardized reporting processes, such as logging signal issues or documenting hardware failures. This streamlines the communication between field staff and office teams.

3. **Access to Quick Reference Materials:** Technicians often need information on specific configurations, safety practices, or network setup guidelines. The bot can provide relevant information on-the-fly, reducing downtime and improving efficiency.

4. **Training Aid for New Technicians:** New field staff can use the bot as a training tool to learn about troubleshooting, equipment handling, and telecom protocols, gaining confidence and knowledge directly on the job.

This repository contains a FastAPI-based application that leverages NVIDIA RAG (Retrieval-Augmented Generation) for enhanced document processing. The app processes multiple file types (PDF, PPT, Images, and text) and provides rich metadata and information extraction.

#NVIDIADevContest #LlamaIndex

## Features
- Extracts text, tables, and images from PDFs.
- Processes PowerPoint presentations and converts them to images.
- Supports various file formats including PDF, PPT, and images.
- Automatically extracts metadata like captions and descriptions for images and tables.

## Installation

To run this application locally, follow these steps:

### Prerequisites
- Docker (for containerized deployment)
- Python 3.11 or higher (for local development)

## Configuration

The application supports easy configuration of models and API endpoints through environment variables. Users can configure their preferred models for language generation, graph processing, and image processing by modifying the `.env` file.

### Configuration File (`config.py`)

In the `config.py` file, the application loads the necessary environment variables from the `.env` file. The key parameters are:

- **LLM (Language Model):** Defines the language model to be used for natural language processing tasks. By default, it is set to `meta/llama-3.1-70b-instruct`.
  
- **GRAPH_MODEL:** Specifies the graph processing model. The default value is `google/deplot`.

- **IMAGE_MODEL:** Configures the image processing model. The default value is `nvidia/neva-22b`.

- **GRAPH_MODEL_API:** The API endpoint for the graph model.

- **IMAGE_MODEL_API:** The API endpoint for the image model.

You can modify these values by creating a `.env` file in the project root directory with the following entries:

##### LLM=your-chosen-llm-model 
##### EMBED_MODEL=your-chosen-embedding-model
##### GRAPH_MODEL=your-chosen-graph-model 
##### IMAGE_MODEL=your-chosen-image-model 
##### GRAPH_MODEL_API=https://your-graph-model-api-endpoint 
##### IMAGE_MODEL_API=https://your-image-model-api-endpoint

### Setup with Docker
1. Clone this repository:
    ```bash
    git clone https://github.com/ligaments-dev/nvidia_contest.git
    cd nvidia_contest
    ```

2. Build the Docker image:
    ```bash
    docker build -t nvidia_contest .
    ```

3. Run the Docker container:
    ```bash
    docker run -p 8697:8697 nvidia_contest
    ```

4. Access the backend app by hitting [http://localhost:8697](http://localhost:8697).

### Setup without Docker (local installation)
1. Clone this repository:
    ```bash
    git clone https://github.com/ligaments-dev/nvidia_contest.git
    cd nvidia_contest
    ```

2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # For Linux/MacOS
    venv\Scripts\activate     # For Windows
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Set the environment variable:
    ```bash
    export NVIDIA_API_KEY=your_api_key_here  # For Linux/MacOS
    set NVIDIA_API_KEY=your_api_key_here     # For Windows
    ```

5. Run the FastAPI app:
    ```bash
    uvicorn nvidia_rag:app --port 8697
    ```

6. Access the backend app by hitting [http://localhost:8697](http://localhost:8697).

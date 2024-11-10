import os
from dotenv import find_dotenv, load_dotenv

# Load environment variables from .env file if it exists
load_dotenv(find_dotenv(raise_error_if_not_found=False))

# Configuration for LLM models and API endpoints
LLM_CONFIG = {
    "llm": os.getenv("LLM", "meta/llama-3.1-70b-instruct"),
    "embed_model": os.getenv("EMBED_MODEL", "nvidia/nv-embedqa-e5-v5"),
    "graph_model": os.getenv("GRAPH_MODEL", "google/deplot"),
    "image_model": os.getenv("IMAGE_MODEL", "nvidia/neva-22b"),
    "graph_model_api": os.getenv("GRAPH_MODEL_API", "https://ai.api.nvidia.com/v1/vlm/google/deplot"),
    "image_model_api": os.getenv("IMAGE_MODEL_API", "https://ai.api.nvidia.com/v1/vlm/nvidia/neva-22b")
}

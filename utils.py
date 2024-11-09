import os
import base64
import fitz
from io import BytesIO
from PIL import Image
import requests
from dotenv import find_dotenv, load_dotenv
from llama_index.llms.nvidia import NVIDIA

# Load environment variables from .env file if it exists
load_dotenv(find_dotenv(raise_error_if_not_found=False))

def set_environment_variables():
    """Set necessary environment variables."""
    os.environ["NVIDIA_API_KEY"] = os.getenv("NVIDIA_API_KEY")

def get_b64_image_from_content(image_content):
    """Convert image content to a base64-encoded JPEG string."""
    img = Image.open(BytesIO(image_content)).convert("RGB")
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def is_graph(image_content):
    """Check if an image is a graph, plot, chart, or table."""
    description = describe_image(image_content)
    return any(keyword in description.lower() for keyword in ["graph", "plot", "chart", "table"])

def process_graph(image_content):
    """Generate a description of a graph image."""
    deplot_description = process_graph_deplot(image_content)
    llm = NVIDIA(model_name="meta/llama-3.1-70b-instruct")
    response = llm.complete(
        "Explain the following linearized table for LLM usage: " + deplot_description
    )
    return response.text

def describe_image(image_content):
    """Generate a description of an image using NVIDIA API."""
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise ValueError("NVIDIA API Key is not set. Please set NVIDIA_API_KEY.")

    image_b64 = get_b64_image_from_content(image_content)
    response = requests.post(
        "https://ai.api.nvidia.com/v1/vlm/nvidia/neva-22b",
        headers={"Authorization": f"Bearer {api_key}", "Accept": "application/json"},
        json={
            "messages": [
                {
                    "role": "user",
                    "content": f'Describe this image. <img src="data:image/png;base64,{image_b64}" />'
                }
            ],
            "max_tokens": 1024,
            "temperature": 0.2,
            "top_p": 0.7,
            "seed": 0,
            "stream": False
        }
    )
    return response.json()["choices"][0]['message']['content']

def process_graph_deplot(image_content):
    """Generate data from a graph image using NVIDIA's Deplot API."""
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise ValueError("NVIDIA API Key is not set. Please set NVIDIA_API_KEY.")

    image_b64 = get_b64_image_from_content(image_content)
    response = requests.post(
        "https://ai.api.nvidia.com/v1/vlm/google/deplot",
        headers={"Authorization": f"Bearer {api_key}", "Accept": "application/json"},
        json={
            "messages": [
                {
                    "role": "user",
                    "content": f'Generate underlying data of this figure: <img src="data:image/png;base64,{image_b64}" />'
                }
            ],
            "max_tokens": 1024,
            "temperature": 0.2,
            "top_p": 0.2,
            "stream": False
        }
    )
    return response.json()["choices"][0]['message']['content']

def extract_text_around_item(text_blocks, bbox, page_height, threshold_percentage=0.1):
    """Extract text immediately above and below a bounding box."""
    before_text, after_text = "", ""
    vertical_thresh = page_height * threshold_percentage
    horiz_thresh = bbox.width * threshold_percentage

    for block in text_blocks:
        block_bbox = fitz.Rect(block[:4])
        vertical_dist = min(abs(block_bbox.y1 - bbox.y0), abs(block_bbox.y0 - bbox.y1))
        horiz_overlap = max(0, min(block_bbox.x1, bbox.x1) - max(block_bbox.x0, bbox.x0))

        if vertical_dist <= vertical_thresh and horiz_overlap >= -horiz_thresh:
            if block_bbox.y1 < bbox.y0 and not before_text:
                before_text = block[4]
            elif block_bbox.y0 > bbox.y1 and not after_text:
                after_text = block[4]
                break

    return before_text, after_text

def process_text_blocks(text_blocks, char_count_threshold=500):
    """Group text blocks by character count threshold."""
    grouped_blocks = []
    current_group, current_char_count = [], 0

    for block in text_blocks:
        if block[-1] == 0:  # Check if block is text
            block_text, block_char_count = block[4], len(block[4])
            if current_char_count + block_char_count <= char_count_threshold:
                current_group.append(block)
                current_char_count += block_char_count
            else:
                if current_group:
                    grouped_blocks.append((current_group[0], "\n".join(b[4] for b in current_group)))
                current_group, current_char_count = [block], block_char_count

    if current_group:
        grouped_blocks.append((current_group[0], "\n".join(b[4] for b in current_group)))

    return grouped_blocks

def save_uploaded_file(uploaded_file):
    """Save an uploaded file to a temporary directory."""
    temp_dir = os.path.join(os.getcwd(), "vectorstore", "ppt_references", "tmp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, uploaded_file.name)
    
    with open(temp_file_path, "wb") as temp_file:
        temp_file.write(uploaded_file.read())
    
    return temp_file_path
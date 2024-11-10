# Use a base image with Python 3.11.9
FROM python:3.11.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt . 

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Copy the .env file into the container (ensure it's not git-tracked)
COPY .env .env

# Expose the port that Streamlit will run on
EXPOSE 8697

# Command to run the Streamlit app
CMD ["uvicorn", "nvidia_rag:app", "--port", "8697"]

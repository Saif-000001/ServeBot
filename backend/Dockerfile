# Backend Dockerfile 

# Use official Python 3.12 Bullseye image (includes basic build tools)
FROM python:3.12-bullseye

# Set working directory inside the container
WORKDIR /app

# Install system dependencies required by Python packages
RUN apt-get update && apt-get install -y \
    build-essential \       
    libglib2.0-0 \          
    libsm6 \                 
    libxext6 \               
    libxrender-dev \         
    libgl1-mesa-glx \        
    && rm -rf /var/lib/apt/lists/*  # Clean up cache to reduce image size

# Copy only requirements first for caching
COPY requirements.txt .

# Install Python dependencies
# Using no-cache-dir to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files
COPY . /app

# Expose FastAPI port
EXPOSE 8000

# Start FastAPI server using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

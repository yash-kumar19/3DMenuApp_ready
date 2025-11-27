# ============================================
# EXPLANATION: This is the "recipe" for building our container
# Think of it like a recipe that says "install this, copy that, run this command"
# ============================================

# Step 1: Start with Ubuntu Linux 
# WHY? Blender is a Linux application and needs Linux libraries
FROM ubuntu:22.04

# Step 2: Don't ask for user input during installs (automated install)
ENV DEBIAN_FRONTEND=noninteractive

# Step 3: Install system dependencies
# - wget: Download files
# - xz-utils: Uncompress Blender archive
# - python3: Run our Flask app
# - pip: Install Python packages
RUN apt-get update && apt-get install -y \
    wget \
    xz-utils \
    python3 \
    python3-pip \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Step 4: Download and install Blender
# WHY version 3.6? It's stable and has all features we need
# We put it in /opt/blender (industry standard location)
RUN wget https://download.blender.org/release/Blender3.6/blender-3.6.0-linux-x64.tar.xz \
    && tar -xf blender-3.6.0-linux-x64.tar.xz -C /opt \
    && mv /opt/blender-3.6.0-linux-x64 /opt/blender \
    && rm blender-3.6.0-linux-x64.tar.xz

# Step 5: Add Blender to PATH
# This lets us type just "blender" instead of "/opt/blender/blender"
ENV PATH="/opt/blender:${PATH}"

# Step 6: Set working directory
# All our files will go in /app
WORKDIR /app

# Step 7: Copy Python requirements and install them
# We do this BEFORE copying code for better Docker caching
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Step 8: Copy our application files
COPY app.py .
COPY blender-cleanup.py .

# Step 9: Tell Docker we'll use port 8080
# Google Cloud Run expects this port
EXPOSE 8080

# Step 10: Start the Flask server when container runs
# 0.0.0.0 means "accept connections from anywhere"
# Port 8080 is the Cloud Run standard
CMD ["python3", "app.py"]

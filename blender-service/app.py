# ============================================
# EXPLANATION: This is our web API that accepts GLB files and cleans them
# It's a Flask server (similar to Express.js but in Python)
# ============================================

from flask import Flask, request, jsonify, send_file
import os
import subprocess
import requests
from pathlib import Path
import tempfile

# Create Flask app
app = Flask(__name__)

# Health check endpoint (Cloud Run uses this to check if service is alive)
@app.route('/health', methods=['GET'])
def health():
    """
    EXPLANATION: Health check endpoint
    Cloud Run pings this to make sure the service is running
    Returns 200 OK if everything is fine
    """
    return jsonify({"status": "healthy"}), 200


@app.route('/cleanup', methods=['POST'])
def cleanup_model():
    """
    EXPLANATION: Main endpoint that cleans up 3D models
    
    How it works:
    1. Receive GLB URL from Next.js
    2. Download the GLB file
    3. Run Blender script to clean it
    4. Return the cleaned GLB
    """
    
    try:
        # Get input from request
        data = request.get_json()
        glb_url = data.get('glb_url')
        target_faces = data.get('target_faces', 50000)
        
        if not glb_url:
            return jsonify({"error": "glb_url is required"}), 400
        
        print(f"[INFO] Starting cleanup for: {glb_url}")
        print(f"[INFO] Target face count: {target_faces}")
        
        # Create temporary directory for processing
        # WHY? We don't want to clutter the filesystem
        with tempfile.TemporaryDirectory() as temp_dir:
            # File paths
            input_path = os.path.join(temp_dir, 'input.glb')
            output_path = os.path.join(temp_dir, 'output.glb')
            
            # Step 1: Download GLB from URL
            print(f"[INFO] Downloading model...")
            response = requests.get(glb_url)
            with open(input_path, 'wb') as f:
                f.write(response.content)
            print(f"[INFO] Downloaded {len(response.content)} bytes")
            
            # Step 2: Run Blender cleanup
            print(f"[INFO] Running Blender cleanup...")
            
            # Command breakdown:
            # blender: The Blender executable
            # --background: Run without GUI (headless mode)
            # --python blender-cleanup.py: Run our Python script
            # -- : Everything after this goes to our script
            # input.glb output.glb target_faces: Arguments to our script
            
            blender_cmd = [
                'blender',
                '--background',
                '--python', 'blender-cleanup.py',
                '--',
                input_path,
                output_path,
                str(target_faces)
            ]
            
            # Run the command and capture output
            result = subprocess.run(
                blender_cmd,
                capture_output=True,
                text=True,
                timeout=120  # 2 minutes max
            )
            
            # Check if Blender succeeded
            if result.returncode != 0:
                print(f"[ERROR] Blender failed: {result.stderr}")
                return jsonify({"error": "Blender processing failed", "details": result.stderr}), 500
            
            print(f"[INFO] Blender output: {result.stdout}")
            
            # Step 3: Check if output file exists
            if not os.path.exists(output_path):
                return jsonify({"error": "Cleanup failed, no output generated"}), 500
            
            # Step 4: Get file size for logging
            file_size = os.path.getsize(output_path)
            print(f"[INFO] Cleanup complete! Output size: {file_size} bytes")
            
            # Step 5: Return the cleaned GLB file
            # The file will be sent as binary data
            return send_file(
                output_path,
                mimetype='model/gltf-binary',
                as_attachment=True,
                download_name='cleaned.glb'
            )
    
    except requests.RequestException as e:
        print(f"[ERROR] Download failed: {str(e)}")
        return jsonify({"error": "Failed to download model", "details": str(e)}), 500
    
    except subprocess.TimeoutExpired:
        print(f"[ERROR] Blender timeout")
        return jsonify({"error": "Processing timeout"}), 504
    
    except Exception as e:
        print(f"[ERROR] Unexpected error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


if __name__ == '__main__':
    # Start server
    # WHY 0.0.0.0? This makes it accessible from outside the container
    # WHY 8080? Google Cloud Run standard port
    port = int(os.environ.get('PORT', 8080))
    print(f"[INFO] Starting Blender Cleanup Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)

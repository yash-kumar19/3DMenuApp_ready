# Blender Cleanup Service

## 🎯 What This Does
Automatically cleans up 3D models from Kiri Engine:
- Removes mesh artifacts
- Reduces polygon count to 50K (web-optimized)
- Fixes UVs and normals
- Ensures consistent quality

## 📁 Files
- `Dockerfile` - Container recipe
- `app.py` - Flask API
- `blender-cleanup.py` - Blender automation
- `requirements.txt` - Python dependencies

## 🚀 Local Testing (Optional)
```bash
# Build container
docker build -t blender-cleanup .

# Run locally
docker run -p 8080:8080 blender-cleanup

# Test endpoint
curl -X POST http://localhost:8080/cleanup \
  -H "Content-Type: application/json" \
  -d '{"glb_url": "https://example.com/model.glb", "target_faces": 50000}'
```

## ☁️ Deploy to Google Cloud Run
```bash
# 1. Set your project ID
export PROJECT_ID="your-gcp-project-id"

# 2. Build and push
gcloud builds submit --tag gcr.io/$PROJECT_ID/blender-cleanup

# 3. Deploy
gcloud run deploy blender-cleanup \
  --image gcr.io/$PROJECT_ID/blender-cleanup \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --timeout 120s \
  --allow-unauthenticated

# 4. Get your service URL
gcloud run services describe blender-cleanup --region us-central1 --format 'value(status.url)'
```

## 🔗 Integration with Next.js
After deploying, add this environment variable to your Next.js app:
```
BLENDER_SERVICE_URL=https://blender-cleanup-xxx.run.app
```

Then the API route will automatically use it!

## 💰 Cost
- ~$0.01 per model
- Free tier: First 2 million requests/month
- 1000 models/month ≈ $10

## 🔒 Security (Production)
Add API key authentication:
1. Generate key: `openssl rand -hex 32`
2. Add to Cloud Run environment: `BLENDER_API_KEY`
3. Require in Next.js requests

## ❓ Troubleshooting
- **Timeout**: Increase `--timeout` to 180s
- **Out of memory**: Increase `--memory` to 4Gi
- **Blender fails**: Check logs with `gcloud run logs read blender-cleanup`

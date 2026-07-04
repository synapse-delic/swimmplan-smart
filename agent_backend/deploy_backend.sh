#!/bin/bash

# --- Configuration ---
PROJECT_ID="gen-lang-client-0350566948"
REGION="europe-west1"
SERVICE_NAME="swimmplan-smart-backend"

echo "🚀 Starting Deployment for Backend Service: $SERVICE_NAME"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "------------------------------------"

# 1. Set Google Cloud Project
echo "Configuring Google Cloud Project..."
gcloud config set project $PROJECT_ID

# 2. Deploy to Cloud Run
echo "Starting Build and Deployment..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# Check errors
if [ $? -eq 0 ]; then
  echo "✅ Backend Deployment Successful!"
  echo "Service URL:"
  gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
else
  echo "❌ Backend Deployment Failed."
fi

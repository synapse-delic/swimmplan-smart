#!/bin/bash

# --- Konfiguration ---
PROJECT_ID="gen-lang-client-0350566948"
REGION="europe-west1"
SERVICE_NAME="swimmplan-smart"

echo "🚀 Starte Deployment für Service: $SERVICE_NAME"
echo "Projekt: $PROJECT_ID"
echo "Region: $REGION"
echo "------------------------------------"

# 1. Google Cloud Projekt setzen
echo "Konfiguriere Google Cloud Projekt..."
gcloud config set project $PROJECT_ID

# 2. Haupt-Deployment Befehl
echo "Starte Build und Deployment..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# Fehlerprüfung
if [ $? -eq 0 ]; then
  echo "✅ Deployment erfolgreich!"
  echo "Service URL:"
  gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'
else
  echo "❌ Deployment fehlgeschlagen."
fi

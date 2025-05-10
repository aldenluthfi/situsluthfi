#!/bin/bash
set -e

echo "📥 Pulling latest changes..."
git pull --rebase

echo "🛑 Stopping existing containers..."
docker compose down || true

echo "🏗️ Building and starting containers..."
docker compose up -d --build

echo "🧹 Cleaning up unused Docker resources..."
docker system prune -a -f

echo "✅ Deployment completed successfully!"

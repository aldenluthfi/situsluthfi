#!/bin/bash
set -e

echo "📥 Pulling latest changes..."
git pull --rebase

echo "🛑 Stopping existing containers..."
docker compose down || true

echo "🧹 Cleaning up unused Docker resources..."
docker system prune -af
docker volume prune -af

echo "🏗️ Building and starting containers..."
docker compose up -d --build

echo "🧹 Cleaning up unused Docker resources again..."
docker system prune -af
docker volume prune -af

echo "✅ Deployment completed successfully!"

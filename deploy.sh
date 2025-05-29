#!/bin/bash
set -e

echo "📥 Pulling latest changes..."
if [ "$ENV" != "dev" ]; then
    git pull --rebase
else
    echo "Skipping git pull in dev environment."
fi

echo "🛑 Stopping existing containers..."
docker compose down || true

echo "🧹 Cleaning up unused Docker resources..."
docker system prune -af
docker volume prune -af

echo "🏗️ Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for database to be ready..."
until docker exec backend nc -z db 3306; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "🌱 Seeding Data"
docker exec backend node dist/db/seed.js

echo "🧹 Cleaning up unused Docker resources again..."
docker system prune -af
docker volume prune -af

echo "✅ Deployment completed successfully!"

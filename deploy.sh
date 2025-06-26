#!/bin/bash
set -e

echo "🚀 Starting Kubernetes deployment with Kind..."

# Configuration
CLUSTER_NAME="situsluthfi"

# Function to check if kind cluster exists
cluster_exists() {
    kind get clusters | grep -q "^${CLUSTER_NAME}$"
}

# Create kind cluster if it doesn't exist
if ! cluster_exists; then
    echo "🔧 Creating Kind cluster..."
    cat <<EOF | kind create cluster --name="${CLUSTER_NAME}" --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30080
    hostPort: 8080
    protocol: TCP
EOF
fi

# Set kubectl context
kubectl config use-context "kind-${CLUSTER_NAME}"

echo "📥 Pulling latest changes..."
if [ "$ENV" != "dev" ]; then
    git pull --rebase
else
    echo "Skipping git pull in dev environment."
fi

# Create secrets from .env files
echo "🔐 Creating Kubernetes secrets..."

# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Create MySQL secret from root .env
if [ -f ".env" ]; then
    kubectl create secret generic mysql-secret \
        --from-env-file=.env \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
else
    echo "⚠️  Root .env file not found, using .env.example"
    kubectl create secret generic mysql-secret \
        --from-env-file=.env.example \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
fi

# Create backend secret from backend .env
if [ -f "backend/.env" ]; then
    kubectl create secret generic backend-secret \
        --from-env-file=backend/.env \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
else
    echo "⚠️  Backend .env file not found, using backend/.env.example"
    kubectl create secret generic backend-secret \
        --from-env-file=backend/.env.example \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
fi

# Create frontend secret from frontend .env
if [ -f "frontend/.env" ]; then
    kubectl create secret generic frontend-secret \
        --from-env-file=frontend/.env \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
else
    echo "⚠️  Frontend .env file not found, using frontend/.env.example"
    kubectl create secret generic frontend-secret \
        --from-env-file=frontend/.env.example \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
fi

# Build and push Docker images to local registry
echo "🏗️ Building Docker images..."

echo "Building backend image..."
docker build -t situsluthfi-backend:latest ./backend

echo "Building frontend image..."
docker build -t situsluthfi-frontend:latest ./frontend

# Load images directly into Kind cluster
echo "🔄 Loading images into Kind cluster..."
kind load docker-image situsluthfi-backend:latest --name ${CLUSTER_NAME}
kind load docker-image situsluthfi-frontend:latest --name ${CLUSTER_NAME}

# Verify images are available in the cluster
echo "🔍 Verifying images in cluster..."
docker exec ${CLUSTER_NAME}-control-plane crictl images | grep situsluthfi || echo "⚠️  Images not found in cluster, but continuing..."

# Deploy infrastructure (MySQL, Elasticsearch)
echo "🗄️ Deploying infrastructure..."
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/elasticsearch.yaml

# Wait for infrastructure to be ready with better error handling
echo "⏳ Waiting for infrastructure to be ready..."
echo "Checking MySQL deployment status..."
kubectl wait --for=condition=ready pod -l app=mysql --timeout=600s -n situsluthfi || {
    echo "⚠️  MySQL pod timeout, checking status..."
    kubectl get pods -l app=mysql -n situsluthfi
    kubectl describe pods -l app=mysql -n situsluthfi
    kubectl get pvc -n situsluthfi
    echo "Continuing with deployment..."
}

echo "Checking Elasticsearch deployment status..."
kubectl wait --for=condition=ready pod -l app=elasticsearch --timeout=600s -n situsluthfi || {
    echo "⚠️  Elasticsearch pod timeout, checking status..."
    kubectl get pods -l app=elasticsearch -n situsluthfi
    kubectl describe pods -l app=elasticsearch -n situsluthfi
    echo "Continuing with deployment..."
}

# Deploy application services with rolling update
echo "📦 Deploying application services..."
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# Wait for deployments to complete with better error handling
echo "⏳ Waiting for application deployments to complete..."
echo "Checking backend deployment status..."
kubectl rollout status deployment/backend --timeout=300s -n situsluthfi || {
    echo "⚠️  Backend deployment timeout, checking status..."
    kubectl get pods -l app=backend -n situsluthfi
    kubectl describe pods -l app=backend -n situsluthfi
    kubectl logs -l app=backend -n situsluthfi --tail=50
    echo "Continuing with deployment..."
}

echo "Checking frontend deployment status..."
kubectl rollout status deployment/frontend --timeout=300s -n situsluthfi || {
    echo "⚠️  Frontend deployment timeout, checking status..."
    kubectl get pods -l app=frontend -n situsluthfi
    kubectl describe pods -l app=frontend -n situsluthfi
    kubectl logs -l app=frontend -n situsluthfi --tail=50
    echo "Continuing with deployment..."
}

# Run database seeding
echo "🌱 Seeding database..."
kubectl wait --for=condition=ready pod -l app=backend --timeout=300s -n situsluthfi
BACKEND_POD=$(kubectl get pods -l app=backend -n situsluthfi -o jsonpath="{.items[0].metadata.name}")
kubectl exec -n situsluthfi $BACKEND_POD -- node dist/db/seed.js

echo "✅ Deployment completed successfully!"
echo "🌐 Access your application at:"
echo "   - http://localhost:8080 (NodePort)"
echo ""
echo "📊 Useful commands:"
echo "   - Check status: kubectl get all -n situsluthfi"
echo "   - View logs: kubectl logs -f deployment/backend -n situsluthfi"
echo "   - Scale deployment: kubectl scale deployment/frontend --replicas=2 -n situsluthfi"
echo "   - Check services: kubectl get svc -n situsluthfi"
echo "   - Cleanup: ./cleanup.sh"
echo "   - Kind cluster info: kind get clusters"
echo "   - Load image to cluster: kind load docker-image <image> --name ${CLUSTER_NAME}"
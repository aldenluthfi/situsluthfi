#!/bin/bash
set -e

echo "🚀 Starting Kubernetes deployment with Kind..."

# Configuration
CLUSTER_NAME="situsluthfi"
TIMESTAMP=$(date +%s)
BACKEND_IMAGE="situsluthfi-backend:${TIMESTAMP}"
FRONTEND_IMAGE="situsluthfi-frontend:${TIMESTAMP}"

# Create kind cluster if it doesn't exist
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
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

kubectl config use-context "kind-${CLUSTER_NAME}"

# Pull latest changes (skip in dev)
if [ "$ENV" != "dev" ]; then
    echo "📥 Pulling latest changes..."
    git pull --rebase
fi

# Create namespace and secrets
echo "🔐 Creating namespace and secrets..."
kubectl apply -f k8s/namespace.yaml

for component in mysql backend frontend; do
    if [ "$component" = "mysql" ]; then
        env_file=".env"
        secret_name="mysql-secret"
    else
        env_file="${component}/.env"
        secret_name="${component}-secret"
    fi

    # Use .env or fallback to .env.example
    if [ -f "$env_file" ]; then
        source_file="$env_file"
    else
        source_file="${env_file}.example"
        echo "⚠️  ${env_file} not found, using ${source_file}"
    fi

    kubectl create secret generic "$secret_name" \
        --from-env-file="$source_file" \
        --namespace=situsluthfi \
        --dry-run=client -o yaml | kubectl apply -f -
done

# Build and load Docker images
echo "🏗️ Building and loading Docker images..."
docker build -t "${BACKEND_IMAGE}" ./backend
docker build -t "${FRONTEND_IMAGE}" ./frontend

kind load docker-image "${BACKEND_IMAGE}" --name ${CLUSTER_NAME}
kind load docker-image "${FRONTEND_IMAGE}" --name ${CLUSTER_NAME}

# Deploy infrastructure
echo "🗄️ Deploying infrastructure..."
kubectl apply -f k8s/mysql.yaml -f k8s/elasticsearch.yaml

# Wait for infrastructure to be ready
echo "⏳ Waiting for infrastructure..."
kubectl wait --for=condition=available deployment/mysql deployment/elasticsearch --timeout=600s -n situsluthfi

# Deploy applications with correct image tags
echo "📦 Deploying applications..."
sed "s|situsluthfi-backend:latest|${BACKEND_IMAGE}|g" k8s/backend.yaml | kubectl apply -f -
sed "s|situsluthfi-frontend:latest|${FRONTEND_IMAGE}|g" k8s/frontend.yaml | kubectl apply -f -

# Wait for application deployments
echo "⏳ Waiting for applications..."
kubectl wait --for=condition=available deployment/backend deployment/frontend --timeout=600s -n situsluthfi

# Wait for backend pod to be running and ready
echo "⏳ Waiting for backend pod to be ready..."
kubectl wait --for=condition=ready pod -l app=backend -n situsluthfi --timeout=300s

# Seed database
echo "🌱 Seeding database..."

# Get backend pod and verify it exists
BACKEND_POD=$(kubectl get pods -l app=backend -n situsluthfi --field-selector=status.phase=Running -o jsonpath="{.items[0].metadata.name}")

if [ -z "$BACKEND_POD" ]; then
    echo "❌ No running backend pod found"
    exit 1
fi

echo "🎯 Using backend pod: $BACKEND_POD"
kubectl exec -n situsluthfi $BACKEND_POD -- node dist/db/seed.js

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: http://localhost:8080"
echo "📊 Check status: kubectl get all -n situsluthfi"
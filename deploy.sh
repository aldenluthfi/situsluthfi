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

# Build backend with error handling
echo "🔨 Building backend image..."
if ! docker build --no-cache -t "${BACKEND_IMAGE}" ./backend; then
    echo "❌ Backend build failed, trying with cache cleared..."
    docker system prune -f
    if ! docker build -t "${BACKEND_IMAGE}" ./backend; then
        echo "❌ Backend build failed even after cache clear - continuing anyway"
    fi
fi

# Build frontend with error handling and cache clearing
echo "🔨 Building frontend image..."
if ! docker build --no-cache -t "${FRONTEND_IMAGE}" ./frontend; then
    echo "❌ Frontend build failed, trying with cache cleared..."
    docker system prune -f
    if ! docker build -t "${FRONTEND_IMAGE}" ./frontend; then
        echo "❌ Frontend build failed even after cache clear - continuing anyway"
    fi
fi

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

# Get the newest backend pod from current deployment
echo "🔍 Finding the newest backend pod..."
BACKEND_POD=$(kubectl get pods -l app=backend -n situsluthfi \
    --field-selector=status.phase=Running \
    --sort-by='.metadata.creationTimestamp' \
    -o jsonpath="{.items[-1:].metadata.name}")

if [ -z "$BACKEND_POD" ]; then
    echo "❌ No running backend pod found - skipping database seeding"
else
    # Verify the pod is from current deployment by checking image tag
    POD_IMAGE=$(kubectl get pod $BACKEND_POD -n situsluthfi -o jsonpath="{.spec.containers[0].image}")
    if [[ "$POD_IMAGE" != "$BACKEND_IMAGE" ]]; then
        echo "⚠️  Pod $BACKEND_POD is using old image $POD_IMAGE, waiting for new pod..."
        # Wait a bit more and try again
        sleep 10
        BACKEND_POD=$(kubectl get pods -l app=backend -n situsluthfi \
            --field-selector=status.phase=Running \
            --sort-by='.metadata.creationTimestamp' \
            -o jsonpath="{.items[-1:].metadata.name}")

        if [ -z "$BACKEND_POD" ]; then
            echo "❌ Still no running backend pod found - skipping database seeding"
        else
            POD_IMAGE=$(kubectl get pod $BACKEND_POD -n situsluthfi -o jsonpath="{.spec.containers[0].image}")
            if [[ "$POD_IMAGE" != "$BACKEND_IMAGE" ]]; then
                echo "❌ Pod $BACKEND_POD still using old image $POD_IMAGE instead of $BACKEND_IMAGE - seeding anyway"
            fi
        fi
    fi

    if [ -n "$BACKEND_POD" ]; then
        echo "🎯 Using backend pod: $BACKEND_POD (image: $POD_IMAGE)"
        kubectl exec -n situsluthfi $BACKEND_POD -- node dist/db/seed.js || echo "❌ Database seeding failed - continuing anyway"
    fi
fi

# Clean up old replica sets
echo "🧹 Cleaning up old replica sets..."
kubectl get replicasets -n situsluthfi -o jsonpath='{range .items[*]}{.metadata.name}{" "}{.spec.replicas}{"\n"}{end}' | \
awk '$2 == "0" {print $1}' | \
xargs -r kubectl delete replicaset -n situsluthfi || echo "No old replica sets to clean up"

# Final Docker cleanup
echo "🧹 Final Docker cleanup..."
docker system prune -a -f || echo "No unused Docker resources to clean up"

# Clean up old images using crictl
echo "🧹 Cleaning up old images with crictl..."
docker exec situsluthfi-control-plane crictl rmi --prune || echo "No images to prune with crictl"

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: http://localhost:8080"
echo "📊 Check status: kubectl get all -n situsluthfi"
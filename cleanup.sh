#!/bin/bash
set -e

echo "🧹 Starting Kubernetes cleanup..."

# Configuration
CLUSTER_NAME="situsluthfi"
REGISTRY_NAME="kind-registry"
REGISTRY_PORT="5001"

# Function to check if resource exists
resource_exists() {
    kubectl get $1 $2 -n $3 >/dev/null 2>&1
}

# Function to delete resource if it exists
delete_if_exists() {
    if resource_exists $1 $2 $3; then
        echo "🗑️  Deleting $1/$2 in namespace $3..."
        kubectl delete $1 $2 -n $3 --ignore-not-found=true
    fi
}

# Check if kind cluster exists
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    echo "⚠️  Kind cluster '${CLUSTER_NAME}' not found. Nothing to clean up."
    exit 0
fi

# Set kubectl context
kubectl config use-context "kind-${CLUSTER_NAME}"

# Delete application deployments and services
echo "📦 Removing application services..."
delete_if_exists deployment backend situsluthfi
delete_if_exists deployment frontend situsluthfi
delete_if_exists service backend situsluthfi
delete_if_exists service frontend situsluthfi

# Delete infrastructure deployments and services
echo "🗄️ Removing infrastructure services..."
delete_if_exists deployment mysql situsluthfi
delete_if_exists deployment elasticsearch situsluthfi
delete_if_exists service mysql situsluthfi
delete_if_exists service elasticsearch situsluthfi

# Delete ingress
echo "🌐 Removing ingress..."
delete_if_exists ingress situsluthfi-ingress situsluthfi

# Delete secrets
echo "🔐 Removing secrets..."
delete_if_exists secret mysql-secret situsluthfi
delete_if_exists secret backend-secret situsluthfi
delete_if_exists secret frontend-secret situsluthfi

# Delete persistent volume claims
echo "💾 Removing persistent volume claims..."
delete_if_exists pvc mysql-pvc situsluthfi
delete_if_exists pvc es-pvc situsluthfi

# Delete persistent volumes (cluster-wide)
echo "🗂️  Removing persistent volumes..."
if kubectl get pv mysql-pv >/dev/null 2>&1; then
    echo "🗑️  Deleting persistent volume mysql-pv..."
    kubectl delete pv mysql-pv --ignore-not-found=true
fi

if kubectl get pv es-pv >/dev/null 2>&1; then
    echo "🗑️  Deleting persistent volume es-pv..."
    kubectl delete pv es-pv --ignore-not-found=true
fi

# Delete namespace (this will delete everything in it)
echo "🏠 Removing namespace..."
if kubectl get namespace situsluthfi >/dev/null 2>&1; then
    echo "🗑️  Deleting namespace situsluthfi..."
    kubectl delete namespace situsluthfi --ignore-not-found=true

    # Wait for namespace to be fully deleted
    echo "⏳ Waiting for namespace to be fully deleted..."
    while kubectl get namespace situsluthfi >/dev/null 2>&1; do
        echo "   Still deleting namespace..."
        sleep 5
    done
fi

# Clean up local registry images (optional)
read -p "🐳 Do you want to remove images from local registry? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing images from local registry..."

    # Remove images from local registry if registry is running
    if docker ps --filter "name=${REGISTRY_NAME}" --filter "status=running" | grep -q "${REGISTRY_NAME}"; then
        echo "   Removing situsluthfi images from registry..."
        # Note: Registry cleanup is complex, we'll just note the images are there
        echo "   Registry images remain in localhost:${REGISTRY_PORT}/situsluthfi-*"
        echo "   To fully clean registry, you can restart it: docker restart ${REGISTRY_NAME}"
    fi

    # Clean up local Docker images
    if docker images | grep -q "localhost:${REGISTRY_PORT}/situsluthfi-backend"; then
        docker rmi "localhost:${REGISTRY_PORT}/situsluthfi-backend:latest" --force >/dev/null 2>&1 || true
        echo "   Removed localhost:${REGISTRY_PORT}/situsluthfi-backend:latest"
    fi

    if docker images | grep -q "localhost:${REGISTRY_PORT}/situsluthfi-frontend"; then
        docker rmi "localhost:${REGISTRY_PORT}/situsluthfi-frontend:latest" --force >/dev/null 2>&1 || true
        echo "   Removed localhost:${REGISTRY_PORT}/situsluthfi-frontend:latest"
    fi

    # Clean up dangling images
    echo "🧹 Cleaning up dangling images..."
    docker image prune -af >/dev/null 2>&1 || true
fi

# Delete kind cluster (optional)
read -p "💥 Do you want to delete the Kind cluster? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💥 Deleting Kind cluster..."
    kind delete cluster --name="${CLUSTER_NAME}"
fi

# Stop and remove local registry (optional)
read -p "🗄️ Do you want to stop and remove the local registry? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker ps -a --filter "name=${REGISTRY_NAME}" | grep -q "${REGISTRY_NAME}"; then
        echo "🛑 Stopping and removing local registry..."
        docker stop "${REGISTRY_NAME}" >/dev/null 2>&1 || true
        docker rm "${REGISTRY_NAME}" >/dev/null 2>&1 || true
    fi
fi

echo "✅ Cleanup completed successfully!"
echo ""
echo "📊 You can verify cleanup with:"
echo "   - Check Kind clusters: kind get clusters"
echo "   - Check Docker containers: docker ps -a"
echo "   - Check Docker images: docker images"
echo "   - Check registry: docker ps --filter name=${REGISTRY_NAME}"

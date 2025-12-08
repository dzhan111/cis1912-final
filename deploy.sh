#!/bin/bash
# Deployment script for Expense Tracker
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
BUILDER_NAME="expense-builder"

echo "🚀 Starting deployment (region: $REGION)"

command -v terraform >/dev/null || { echo "Terraform not found"; exit 1; }
command -v aws >/dev/null || { echo "AWS CLI not found"; exit 1; }
command -v docker >/dev/null || { echo "Docker not found"; exit 1; }

echo "📦 Step 1: Applying infrastructure..."
pushd terraform >/dev/null
terraform apply -auto-approve

BACKEND_ECR=$(terraform output -raw backend_ecr_repository_url)
FRONTEND_ECR=$(terraform output -raw frontend_ecr_repository_url)
ALB_DNS=$(terraform output -raw alb_dns_name)
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
BACKEND_SERVICE=$(terraform output -raw backend_service_name)
FRONTEND_SERVICE=$(terraform output -raw frontend_service_name)
popd >/dev/null

echo "✅ Infra ready"
echo "   Backend ECR:   $BACKEND_ECR"
echo "   Frontend ECR:  $FRONTEND_ECR"
echo "   ALB DNS:       $ALB_DNS"

echo "🔧 Ensuring buildx builder ($BUILDER_NAME)..."
if ! docker buildx inspect "$BUILDER_NAME" >/dev/null 2>&1; then
  docker buildx create --name "$BUILDER_NAME" --driver docker-container
fi
docker buildx use "$BUILDER_NAME"

ECR_REGISTRY="${BACKEND_ECR%/*}"
echo "🔐 Step 2: Logging into ECR registry $ECR_REGISTRY"
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "🐳 Step 3: Building/pushing backend (multi-arch)..."
pushd backend >/dev/null
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "$BACKEND_ECR:latest" \
  --push \
  .
popd >/dev/null

echo "🐳 Step 4: Building/pushing frontend (multi-arch, API -> ALB)..."
pushd frontend >/dev/null
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "$FRONTEND_ECR:latest" \
  --build-arg VITE_API_URL="http://$ALB_DNS" \
  --push \
  .
popd >/dev/null

echo "🚢 Step 5: Forcing ECS deployments..."
aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$BACKEND_SERVICE" \
  --force-new-deployment \
  --region "$REGION" \
  --no-cli-pager >/dev/null

aws ecs update-service \
  --cluster "$CLUSTER_NAME" \
  --service "$FRONTEND_SERVICE" \
  --force-new-deployment \
  --region "$REGION" \
  --no-cli-pager >/dev/null

echo "⏳ Waiting for services to stabilize..."
aws ecs wait services-stable \
  --cluster "$CLUSTER_NAME" \
  --services "$BACKEND_SERVICE" "$FRONTEND_SERVICE" \
  --region "$REGION"

echo ""
echo "🎉 Deployment complete!"
echo "📍 App: http://$ALB_DNS"

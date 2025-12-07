#!/bin/bash

# Deployment script for Expense Tracker

set -e

echo "🚀 Starting deployment..."

# Step 1: Complete infrastructure
echo "📦 Step 1: Completing infrastructure setup..."
cd terraform
terraform apply -auto-approve

# Get outputs
BACKEND_ECR=$(terraform output -raw backend_ecr_repository_url)
FRONTEND_ECR=$(terraform output -raw frontend_ecr_repository_url)
ALB_DNS=$(terraform output -raw alb_dns_name)
CLUSTER_NAME=$(terraform output -raw ecs_cluster_name)
BACKEND_SERVICE=$(terraform output -raw backend_service_name)
FRONTEND_SERVICE=$(terraform output -raw frontend_service_name)

echo "✅ Infrastructure ready!"
echo "   Backend ECR: $BACKEND_ECR"
echo "   Frontend ECR: $FRONTEND_ECR"
echo "   ALB DNS: $ALB_DNS"

# Step 2: Login to ECR
echo ""
echo "🔐 Step 2: Logging into ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $BACKEND_ECR

# Step 3: Build and push backend
echo ""
echo "🐳 Step 3: Building and pushing backend image..."
cd ../backend
docker build -t expense-tracker-backend .
docker tag expense-tracker-backend:latest $BACKEND_ECR:latest
docker push $BACKEND_ECR:latest
echo "✅ Backend image pushed!"

# Step 4: Build and push frontend
echo ""
echo "🐳 Step 4: Building and pushing frontend image..."
cd ../frontend
docker build -t expense-tracker-frontend .
docker tag expense-tracker-frontend:latest $FRONTEND_ECR:latest
docker push $FRONTEND_ECR:latest
echo "✅ Frontend image pushed!"

# Step 5: Deploy to ECS
echo ""
echo "🚢 Step 5: Deploying to ECS..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $BACKEND_SERVICE \
  --force-new-deployment \
  --region us-east-1 \
  --no-cli-pager > /dev/null

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $FRONTEND_SERVICE \
  --force-new-deployment \
  --region us-east-1 \
  --no-cli-pager > /dev/null

echo "✅ Services updated! Waiting for deployment to stabilize..."

# Wait for services to stabilize
aws ecs wait services-stable \
  --cluster $CLUSTER_NAME \
  --services $BACKEND_SERVICE $FRONTEND_SERVICE \
  --region us-east-1

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📍 Your application is available at:"
echo "   http://$ALB_DNS"
echo ""
echo "💡 Note: It may take a few minutes for the ALB to become fully ready."
echo "   Also, make sure to initialize the database tables."


# Deployment Guide

## Step 1: Complete Infrastructure Setup

### Check current state:
```bash
cd terraform
terraform state list
```

### If RDS is missing, create it:
```bash
terraform apply -target=aws_db_instance.main
```

### If ECS services are missing, create them:
```bash
terraform apply -target=aws_ecs_service.backend
terraform apply -target=aws_ecs_service.frontend
```

### Or apply everything:
```bash
terraform apply
```

## Step 2: Get ECR Repository URLs

```bash
cd terraform
terraform output backend_ecr_repository_url
terraform output frontend_ecr_repository_url
terraform output alb_dns_name
```

You should see:
- Backend: `318035413014.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-backend`
- Frontend: `318035413014.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-frontend`
- ALB DNS: e.g. `expense-tracker-alb-xxxx.us-east-1.elb.amazonaws.com`

## Step 3: Login to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 318035413014.dkr.ecr.us-east-1.amazonaws.com
```

## Step 4: Build and Push Backend Image (multi-arch)

```bash
# ensure a buildx builder exists
docker buildx create --name expense-builder --driver docker-container --use 2>/dev/null || docker buildx use expense-builder

cd ../backend
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t 318035413014.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-backend:latest \
  --push \
  .
```

## Step 5: Build and Push Frontend Image (multi-arch, API -> ALB)

```bash
cd ../frontend
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t 318035413014.dkr.ecr.us-east-1.amazonaws.com/expense-tracker-frontend:latest \
  --build-arg VITE_API_URL=http://<alb-dns-from-step-2> \
  --push \
  .
```
Replace `<alb-dns-from-step-2>` with the value printed by `terraform output alb_dns_name`.

## Step 6: Deploy to ECS

### Option A: Force new deployment (recommended)
```bash
aws ecs update-service \
  --cluster expense-tracker-cluster \
  --service expense-tracker-backend-service \
  --force-new-deployment \
  --region us-east-1

aws ecs update-service \
  --cluster expense-tracker-cluster \
  --service expense-tracker-frontend-service \
  --force-new-deployment \
  --region us-east-1
```

### Option B: Check service status
```bash
aws ecs describe-services \
  --cluster expense-tracker-cluster \
  --services expense-tracker-backend-service expense-tracker-frontend-service \
  --region us-east-1
```

## Step 7: Get Application URL

```bash
cd terraform
terraform output alb_dns_name
```

Access your app at: `http://<alb-dns-name>`

## Step 8: Initialize Database

The database tables need to be created. You can either:

### Option A: SSH into backend container and run init
```bash
# Get task ID
aws ecs list-tasks --cluster expense-tracker-cluster --service-name expense-tracker-backend-service --region us-east-1

# Run init command (if you have exec access)
aws ecs execute-command --cluster expense-tracker-cluster --task <task-id> --container backend --command "python init_db.py" --interactive --region us-east-1
```

### Option B: Add init to backend startup
Modify backend Dockerfile or app.py to auto-initialize on first run.

## Troubleshooting

### Check ECS service logs:
```bash
aws logs tail /ecs/expense-tracker-backend --follow --region us-east-1
aws logs tail /ecs/expense-tracker-frontend --follow --region us-east-1
```

### Check if services are running:
```bash
aws ecs describe-services \
  --cluster expense-tracker-cluster \
  --services expense-tracker-backend-service expense-tracker-frontend-service \
  --region us-east-1 \
  --query 'services[*].[serviceName,runningCount,desiredCount,status]' \
  --output table
```

### Check task status:
```bash
aws ecs list-tasks --cluster expense-tracker-cluster --region us-east-1
```

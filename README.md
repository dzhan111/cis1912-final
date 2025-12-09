# Expense Tracker - CIS1912 Final Project

## Project Overview

Full-stack expense tracking application deployed on AWS. Users can track expenses by category, view summaries, and manage spending data. Built with React frontend and Flask REST API backend.

## Authors
Benjamin Xu

David Zhan

Zihao Zhou

### DevOps Accomplishments

- **Infrastructure as Code**: AWS infrastructure defined in Terraform (VPC, ECS Fargate, ALB, RDS, ECR, IAM, security groups)
- **Containerization**: Multi-stage Docker builds for frontend and backend
- **Multi-architecture Support**: Images built for amd64 and arm64
- **CI/CD Pipeline**: GitHub Actions workflow for automated deployments on push to main
- **Load Balancing**: ALB with path-based routing (`/api/*` to backend, default to frontend)
- **Health Checks**: Container health checks for both services
- **Security**: Security groups with least-privilege access (ALB → ECS → RDS)

## Code Structure

### Infrastructure (Terraform)

- **`main.tf`**: Provider config, VPC/subnet data sources, ECS cluster
- **`alb.tf`**: ALB, target groups, listener rules for routing
- **`ecs.tf`**: ECS task definitions and services
- **`rds.tf`**: PostgreSQL instance and subnet group
- **`ecr.tf`**: ECR repositories for container images
- **`iam.tf`**: IAM role for ECS task execution
- **`security.tf`**: Security groups for ALB, ECS, RDS
- **`variables.tf`**: Input variables
- **`outputs.tf`**: Output values

### Application Code

**Backend (`backend/`)**:
- **`app.py`**: Flask app factory, CORS, database init
- **`routes.py`**: REST API endpoints (expenses, summary)
- **`models.py`**: SQLAlchemy Expense model
- **`config.py`**: Environment variable configuration
- **`init_db.py`**: Database initialization
- **`Dockerfile`**: Python base image with dependencies

**Frontend (`frontend/`)**:
- **`src/App.jsx`**: Main component
- **`src/components/`**: Expense list, form, filter, summary components
- **`src/services/api.js`**: Axios API client
- **`Dockerfile`**: Multi-stage build (Node.js → nginx)

**Deployment**:
- **`deploy.sh`**: Initial infrastructure setup (run once)
- **`.github/workflows/deploy.yml`**: CI/CD workflow

## How to Test and View

### Prerequisites

- Docker and Docker Compose
- Terraform (>= 1.0)
- AWS CLI configured with credentials
- Docker buildx (for multi-arch builds)

### Local Development

```bash
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

Stop services:
```bash
docker-compose down
```

### Cloud Deployment

**Initial Infrastructure Setup:**

The `deploy.sh` script is used only for initial AWS resource provisioning. Run it once to set up infrastructure:

```bash
bash deploy.sh
```

This script:
1. Applies Terraform to create AWS resources (ALB, ECS, RDS, ECR, security groups)
2. Builds and pushes multi-architecture Docker images to ECR
3. Deploys services to ECS Fargate
4. Outputs the ALB DNS name

**CI/CD Pipeline:**

After initial setup, deployments are automated via GitHub Actions. The workflow (`.github/workflows/deploy.yml`) triggers on pushes to the `main` branch:

1. Builds and pushes Docker images to ECR
2. Updates ECS services with new images
3. Waits for services to stabilize
4. Outputs the ALB DNS name

Required GitHub Secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**Accessing the Application:**

After deployment, access the application at:
- **Application URL**: http://expense-tracker-alb-1155641167.us-east-1.elb.amazonaws.com
- **API Health Check**: http://expense-tracker-alb-1155641167.us-east-1.elb.amazonaws.com/api/health

**Database Initialization:**

After first deployment, initialize the database:

```bash
aws ecs list-tasks --cluster expense-tracker-cluster --service-name expense-tracker-backend-service --region us-east-1

aws ecs execute-command \
  --cluster expense-tracker-cluster \
  --task <task-id> \
  --container backend \
  --command "python init_db.py" \
  --interactive \
  --region us-east-1
```

### Debugging

**Check service status:**
```bash
aws ecs describe-services \
  --cluster expense-tracker-cluster \
  --services expense-tracker-backend-service expense-tracker-frontend-service \
  --region us-east-1 \
  --query 'services[*].[serviceName,runningCount,desiredCount,status]' \
  --output table
```

**Check target group health:**
```bash
BACKEND_TG=$(aws elbv2 describe-target-groups --region us-east-1 --names expense-tracker-backend-tg --query 'TargetGroups[0].TargetGroupArn' --output text)
aws elbv2 describe-target-health --target-group-arn $BACKEND_TG --region us-east-1
```

**View logs:**
```bash
aws logs tail /ecs/expense-tracker-backend --follow --region us-east-1
aws logs tail /ecs/expense-tracker-frontend --follow --region us-east-1
```

**Get ALB DNS name:**
```bash
cd terraform
terraform output alb_dns_name
```

**Test API endpoints:**
```bash
ALB_DNS=$(cd terraform && terraform output -raw alb_dns_name)
curl http://$ALB_DNS/api/health
curl http://$ALB_DNS/api/expenses
```

### Cleanup

To destroy all infrastructure and avoid ongoing costs:

```bash
cd terraform
terraform destroy
```

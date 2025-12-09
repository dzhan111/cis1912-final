# Expense Tracker - CIS1912 Final Project

## Project Overview

This project is a full-stack expense tracking application deployed on AWS using Infrastructure as Code (IaC). The application allows users to track expenses by category, view summaries, and manage their spending data through a React-based frontend and Flask REST API backend.

## People in the group
Benjamin Xu
David Zhan
Zihao Zhou

### DevOps Accomplishments

The primary focus of this project was implementing a complete DevOps pipeline and cloud infrastructure:

- **Infrastructure as Code**: Entire AWS infrastructure defined in Terraform, including VPC networking, ECS Fargate services, Application Load Balancer (ALB), RDS PostgreSQL database, ECR repositories, IAM roles, and security groups
- **Containerization**: Multi-stage Docker builds for both frontend and backend services, optimized for production
- **Multi-architecture Support**: Docker images built for both amd64 and arm64 architectures to support Fargate's architecture requirements
- **Automated Deployment**: Single-command deployment script (`deploy.sh`) that provisions infrastructure, builds and pushes container images, and deploys to ECS
- **Load Balancing & Routing**: ALB configured with path-based routing (`/api/*` to backend, default to frontend)
- **Health Checks**: Container health checks configured for both services with proper startup periods
- **Security**: Security groups configured with least-privilege access (ALB → ECS → RDS)
- **Local Development**: Docker Compose setup for local development and testing

## High-Level Code Structure

### Infrastructure (Terraform)

The infrastructure is organized into modular Terraform files:

- **`main.tf`**: Provider configuration, VPC/subnet data sources, and ECS cluster
- **`alb.tf`**: Application Load Balancer, target groups for frontend/backend, listener rules for API routing
- **`ecs.tf`**: ECS task definitions and services for both frontend and backend containers
- **`rds.tf`**: PostgreSQL database instance and subnet group
- **`ecr.tf`**: Container registries for backend and frontend images
- **`iam.tf`**: IAM role and policies for ECS task execution
- **`security.tf`**: Security groups for ALB, ECS, and RDS with appropriate ingress/egress rules
- **`variables.tf`**: Input variables for configuration
- **`outputs.tf`**: Output values for deployment script integration

### Application Code

**Backend (`backend/`)**:
- **`app.py`**: Flask application factory, CORS configuration, database initialization
- **`routes.py`**: REST API endpoints for expenses (GET, POST, DELETE) and summary
- **`models.py`**: SQLAlchemy Expense model
- **`config.py`**: Configuration management with environment variable support
- **`init_db.py`**: Database initialization script
- **`Dockerfile`**: Multi-stage build with Python dependencies and PostgreSQL client tools

**Frontend (`frontend/`)**:
- **`src/App.jsx`**: Main application component
- **`src/components/`**: React components for expense list, form, filtering, and summary
- **`src/services/api.js`**: Axios client for API communication
- **`Dockerfile`**: Multi-stage build (Node.js builder → nginx production server)

**Deployment**:
- **`deploy.sh`**: Automated deployment script that:
  1. Applies Terraform infrastructure
  2. Logs into ECR
  3. Builds and pushes multi-arch images
  4. Forces ECS service updates
  5. Waits for services to stabilize

## How to Test and View

### Prerequisites

- Docker and Docker Compose
- Terraform (>= 1.0)
- AWS CLI configured with credentials
- Docker buildx (for multi-arch builds)

### Local Development

**Option 1: Docker Compose (Recommended)**

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

**Option 2: Separate Services**

Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://expense_user:expense_password@localhost:5433/expense_tracker
python init_db.py
python app.py
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Cloud Deployment

**One-Command Deployment:**

```bash
bash deploy.sh
```

The script will:
1. Provision all AWS infrastructure via Terraform
2. Build and push multi-architecture Docker images to ECR
3. Deploy services to ECS Fargate
4. Output the ALB DNS name for accessing the application

**First-Time Database Setup:**

After initial deployment, initialize the database:

```bash
# Get cluster and task info
aws ecs list-tasks --cluster expense-tracker-cluster --service-name expense-tracker-backend-service --region us-east-1

# Run database initialization
aws ecs execute-command \
  --cluster expense-tracker-cluster \
  --task <task-id> \
  --container backend \
  --command "python init_db.py" \
  --interactive \
  --region us-east-1
```

### Verification and Testing

**Health Check:**
```bash
curl http://<alb-dns>/api/health
```
d
**Test API Endpoints:**
```bash
# Get all expenses
curl http://<alb-dns>/api/expenses

# Create expense
curl -X POST http://<alb-dns>/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 25.50, "description": "Test expense", "category": "Food"}'

# Get summary
curl http://<alb-dns>/api/expenses/summary
```

**Check Service Health:**
```bash
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn> \
  --region us-east-1
```

**View Application:**
Open the ALB DNS name in your browser (printed by `deploy.sh`). The frontend will automatically route API calls to the backend via the ALB.

### Cleanup

To destroy all infrastructure and avoid ongoing costs:

```bash
cd terraform
terraform destroy
```

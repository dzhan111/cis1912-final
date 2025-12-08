# Expense Tracker (CIS1912 Final)

Full-stack expense tracking app with React/Vite frontend, Flask/PostgreSQL backend, and cloud infra via Terraform → ECS/Fargate + ALB + RDS + ECR. Accomplished: built CRUD API with summaries, responsive UI, health checks, Dockerized services, multi-arch images, and a one-shot `deploy.sh` that applies infra, builds/pushes images, and rolls ECS.

## What’s in the code (high level)
- Frontend (`frontend/`)
  - `src/services/api.js`: Axios client; reads `VITE_API_URL` (defaults to ALB or localhost) and appends `/api/...`.
  - `src/App.jsx` + components: expense list, add form, category filter, summary.
  - `Dockerfile`: multi-stage build; accepts `VITE_API_URL` build arg.
- Backend (`backend/`)
  - `app.py`: Flask entry; wires routes and CORS.
  - `routes.py`: REST handlers for expenses, summary, health.
  - `models.py`: SQLAlchemy models; Postgres-backed.
  - `init_db.py`: initializes tables.
  - `Dockerfile`: Python base, installs deps, runs gunicorn/flask (see file).
- Infra (`terraform/`)
  - `main.tf`, `alb.tf`, `ecs.tf`, `rds.tf`, `ecr.tf`, `iam.tf`, `security.tf`: VPC defaults, ALB with frontend default listener + `/api/*` to backend, ECS Fargate services, RDS Postgres, ECR repos, security groups.
  - `outputs.tf`: exposes ALB DNS and ECR URLs for deploys.
- Deploy automation
  - `deploy.sh`: applies Terraform, logs into ECR, builds/pushes multi-arch images (backend/frontend), forces ECS rollout, waits for stable, and prints ALB URL. Uses `AWS_REGION` or defaults to `us-east-1`.

## How to run / view
### Fast local (Docker Compose)
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# API:      http://localhost:5000/api/health
```
Stop with `docker-compose down`.

### Local dev (separate services)
- Backend: `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && export DATABASE_URL=postgresql://... && python init_db.py && python app.py`
- Frontend: `cd frontend && npm install && npm run dev` (set `VITE_API_URL` in `.env` if not localhost).

### Cloud deploy (one command)
Prereqs: Terraform, AWS CLI (creds configured), Docker with buildx, AWS account.
```bash
bash deploy.sh
```
Script does:
1) `terraform apply` (creates ECR, ALB, ECS, RDS, SGs).  
2) Build/push multi-arch images; frontend baked with `VITE_API_URL` set to the ALB DNS.  
3) Force ECS rolling deploy and wait for services-stable.  
Output prints `http://<alb-dns>`.

DB init (first deploy): exec into backend task and run `python init_db.py`, e.g.  
`aws ecs execute-command --cluster <cluster> --task <task-id> --container backend --command "python init_db.py" --interactive --region <region>`

### What to test / verify
- Health: `curl http://<alb-dns>/api/health`
- Frontend API calls: open the ALB URL in browser; network calls should hit `http://<alb-dns>/api/...` (no localhost, no double `/api`).
- Target health: `aws elbv2 describe-target-health` for frontend/backend target groups.

## Notes
- Multi-arch images are built for amd64/arm64 to satisfy Fargate pulls.
- `terraform/ecs.tf` sets `VITE_API_URL` to the ALB root; the frontend code adds `/api` per call.
- Costs apply when cloud resources run; `terraform destroy` to clean up.***

# Expense Tracker Application

A full-stack expense tracking web application built with React (frontend) and Flask (backend), designed for DevOps deployment with Docker, Kubernetes, and Terraform.

## Features

- ✅ Add, view, and delete expenses
- ✅ Filter expenses by category (Food, Transport, Entertainment, Bills, Other)
- ✅ View expense summaries with totals by category
- ✅ Modern, responsive UI with color-coded categories
- ✅ RESTful API with comprehensive error handling
- ✅ PostgreSQL database for persistent storage
- ✅ Docker containerization ready
- ✅ Health check endpoints for monitoring

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with CSS variables

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **Flask-CORS** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- Ready for Kubernetes and Terraform deployment

## Project Structure

```
cis1912-final/
├── backend/                 # Flask backend application
│   ├── app.py              # Flask app entry point
│   ├── models.py           # Database models
│   ├── routes.py           # API route handlers
│   ├── config.py           # Configuration settings
│   ├── init_db.py          # Database initialization script
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker image
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── styles/         # CSS styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   └── Dockerfile          # Frontend Docker image
├── docker-compose.yml      # Docker Compose configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- OR Node.js 18+ and Python 3.11+ for local development

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cis1912-final
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Run Flask server**
   ```bash
   python app.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Returns API health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "expense-tracker-api"
}
```

#### Get All Expenses
```http
GET /api/expenses?category=Food
```
Retrieves all expenses, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter by category (Food, Transport, Entertainment, Bills, Other)

**Response:**
```json
[
  {
    "id": 1,
    "amount": 25.50,
    "description": "Lunch at restaurant",
    "category": "Food",
    "date": "2024-01-15"
  }
]
```

#### Create Expense
```http
POST /api/expenses
Content-Type: application/json
```
Creates a new expense.

**Request Body:**
```json
{
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "category": "Food",
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "id": 1,
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "category": "Food",
  "date": "2024-01-15"
}
```

#### Delete Expense
```http
DELETE /api/expenses/{id}
```
Deletes an expense by ID.

**Response:**
```json
{
  "message": "Expense deleted successfully"
}
```

#### Get Summary
```http
GET /api/expenses/summary?category=Food
```
Gets expense totals by category and overall total.

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
{
  "totals_by_category": {
    "Food": 150.50,
    "Transport": 45.00
  },
  "overall_total": 195.50,
  "count": 5
}
```

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `FLASK_ENV` - Flask environment (development/production)
- `FLASK_PORT` - Flask server port (default: 5000)
- `CORS_ORIGINS` - Comma-separated list of allowed CORS origins

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Database Schema

### Expense Table
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| amount | Float | Expense amount |
| description | String(200) | Expense description |
| category | String(50) | Expense category |
| date | Date | Expense date |

## Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Style
- Backend follows PEP 8 Python style guide
- Frontend uses ESLint and Prettier (when configured)
- All code includes inline comments for documentation

## DevOps Readiness

This application is designed for easy deployment with DevOps tools:

- ✅ **Docker**: Containerized with Dockerfiles for both services
- ✅ **Docker Compose**: Multi-container setup for local development
- ✅ **Environment Variables**: All configuration via environment variables
- ✅ **Health Checks**: API health endpoint for monitoring
- ✅ **Stateless Backend**: Ready for horizontal scaling
- ✅ **Database Migrations**: SQLAlchemy handles schema management
- ✅ **CORS Configuration**: Configurable for production domains

### Next Steps for DevOps Deployment

1. **Kubernetes Deployment**
   - Create Kubernetes manifests (deployments, services, ingress)
   - Set up persistent volumes for PostgreSQL
   - Configure ConfigMaps and Secrets

2. **Terraform Infrastructure**
   - Define infrastructure as code
   - Set up cloud resources (VPC, databases, load balancers)
   - Configure auto-scaling groups

3. **CI/CD Pipeline**
   - Set up GitHub Actions or GitLab CI
   - Automated testing and building
   - Container registry integration
   - Automated deployment

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env file
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify VITE_API_URL in frontend/.env
- Check CORS_ORIGINS in backend/.env
- Ensure backend is running on correct port

### Database connection errors
- Verify PostgreSQL credentials
- Check if database exists
- Run `python init_db.py` to initialize tables

## License

This project is created for educational purposes as part of CIS1912 DevOps course.

## Author

Created for CIS1912 Final Project - Expense Tracker Application

"""
Configuration module for Flask application.
Handles database connection and CORS settings.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration class."""
    
    # Database configuration - defaults to SQLite for local dev, PostgreSQL for production
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///expenses.db'  # Fallback to SQLite if DATABASE_URL not set
    )
    
    # Disable SQLAlchemy event system to save resources
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask environment
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Server port
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # CORS settings - allow frontend to make requests
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')


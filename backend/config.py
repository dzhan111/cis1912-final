"""
Configuration module for Flask application.
Handles database connection and CORS settings.
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration class."""
    
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///expenses.db'
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')


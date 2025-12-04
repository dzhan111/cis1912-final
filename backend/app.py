"""
Flask application entry point for the expense tracker API.
"""
from flask import Flask
from flask_cors import CORS
from config import Config
from models import db, Expense

def create_app():
    """
    Application factory pattern - creates and configures Flask app.
    
    Returns:
        Flask: Configured Flask application instance
    """
    # Create Flask app instance
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Initialize CORS - allow frontend to make requests
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize SQLAlchemy with app
    db.init_app(app)
    
    # Register API blueprint
    from routes import api_bp
    app.register_blueprint(api_bp)
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    return app

# Create app instance
app = create_app()

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return {'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    db.session.rollback()
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    # Run the Flask development server
    app.run(
        host='0.0.0.0',
        port=app.config['FLASK_PORT'],
        debug=app.config['FLASK_ENV'] == 'development'
    )


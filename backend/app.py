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
    app = Flask(__name__)
    
    app.config.from_object(Config)
    
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    db.init_app(app)
    
    from routes import api_bp
    app.register_blueprint(api_bp)
    
    with app.app_context():
        db.create_all()
    
    return app

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
    app.run(
        host='0.0.0.0',
        port=app.config['FLASK_PORT'],
        debug=app.config['FLASK_ENV'] == 'development'
    )


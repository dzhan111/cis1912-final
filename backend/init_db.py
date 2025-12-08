"""
Database initialization script.
Creates database tables and optionally seeds with sample data.
"""
from app import create_app, db
from models import Expense
from datetime import date

def init_database():
    """
    Initialize the database - create tables and optionally add sample data.
    """
    app = create_app()
    
    with app.app_context():
        # db.drop_all()
        
        db.create_all()
        print("Database tables created successfully!")
        
        """
        sample_expenses = [
            Expense(amount=25.50, description="Lunch at restaurant", category="Food", date=date.today()),
            Expense(amount=15.00, description="Uber ride", category="Transport", date=date.today()),
            Expense(amount=50.00, description="Movie tickets", category="Entertainment", date=date.today()),
            Expense(amount=120.00, description="Electricity bill", category="Bills", date=date.today()),
        ]
        
        for expense in sample_expenses:
            db.session.add(expense)
        
        db.session.commit()
        print("Sample data added successfully!")
        """

if __name__ == '__main__':
    init_database()


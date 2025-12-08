"""
Database models for the expense tracker application.
"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class Expense(db.Model):
    """
    Expense model representing a single expense entry.
    
    Attributes:
        id: Primary key, auto-incrementing integer
        amount: Expense amount (float)
        description: Description of the expense (string)
        category: Category of expense - Food, Transport, Entertainment, Bills, Other (string)
        date: Date when expense was made (date, defaults to today)
    """
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    
    def to_dict(self):
        """
        Convert expense model to dictionary for JSON serialization.
        
        Returns:
            dict: Dictionary representation of the expense
        """
        return {
            'id': self.id,
            'amount': self.amount,
            'description': self.description,
            'category': self.category,
            'date': self.date.isoformat() if self.date else None
        }
    
    def __repr__(self):
        """String representation of the expense."""
        return f'<Expense {self.id}: {self.description} - ${self.amount}>'


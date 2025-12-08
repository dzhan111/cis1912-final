"""
API route handlers for the expense tracker application.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Expense

# Create blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Valid categories for expenses
VALID_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other']

@api_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint for monitoring and DevOps purposes.
    
    Returns:
        JSON: Status message indicating API is running
    """
    return jsonify({'status': 'healthy', 'service': 'expense-tracker-api'}), 200

@api_bp.route('/expenses', methods=['GET'])
def get_expenses():
    """
    Get all expenses, optionally filtered by category.
    
    Query Parameters:
        category (optional): Filter expenses by category
        
    Returns:
        JSON: List of all expenses (or filtered expenses)
    """
    category = request.args.get('category')
    
    query = Expense.query
    if category and category in VALID_CATEGORIES:
        query = query.filter_by(category=category)
    
    expenses = query.order_by(Expense.date.desc(), Expense.id.desc()).all()
    
    return jsonify([expense.to_dict() for expense in expenses]), 200

@api_bp.route('/expenses', methods=['POST'])
def create_expense():
    """
    Create a new expense entry.
    
    Request Body (JSON):
        amount: Expense amount (float, required)
        description: Description of expense (string, required)
        category: Category name (string, required, must be one of valid categories)
        date: Date in YYYY-MM-DD format (string, optional, defaults to today)
        
    Returns:
        JSON: Created expense object with status 201, or error with status 400
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    amount = data.get('amount')
    description = data.get('description')
    category = data.get('category')
    date_str = data.get('date')
    
    if amount is None:
        return jsonify({'error': 'Amount is required'}), 400
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'error': 'Amount must be positive'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Amount must be a valid number'}), 400
    
    if not description or not description.strip():
        return jsonify({'error': 'Description is required'}), 400
    
    if not category or category not in VALID_CATEGORIES:
        return jsonify({
            'error': f'Category must be one of: {", ".join(VALID_CATEGORIES)}'
        }), 400
    
    expense_date = None
    if date_str:
        try:
            expense_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Date must be in YYYY-MM-DD format'}), 400
    else:
        from datetime import date
        expense_date = date.today()
    
    expense = Expense(
        amount=amount,
        description=description.strip(),
        category=category,
        date=expense_date
    )
    
    try:
        db.session.add(expense)
        db.session.commit()
        return jsonify(expense.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create expense: {str(e)}'}), 500

@api_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """
    Delete an expense by ID.
    
    Parameters:
        expense_id: ID of the expense to delete
        
    Returns:
        JSON: Success message with status 200, or error with status 404/500
    """
    expense = Expense.query.get_or_404(expense_id)
    
    try:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({'message': 'Expense deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete expense: {str(e)}'}), 500

@api_bp.route('/expenses/summary', methods=['GET'])
def get_summary():
    """
    Get expense summary - totals by category and overall total.
    
    Query Parameters:
        category (optional): Get summary for specific category only
        
    Returns:
        JSON: Summary object with totals by category and overall total
    """
    category = request.args.get('category')
    
    query = Expense.query
    if category and category in VALID_CATEGORIES:
        query = query.filter_by(category=category)
    
    expenses = query.all()
    
    totals_by_category = {}
    overall_total = 0.0
    
    for expense in expenses:
        if expense.category not in totals_by_category:
            totals_by_category[expense.category] = 0.0
        totals_by_category[expense.category] += expense.amount
        
        overall_total += expense.amount
    
    totals_by_category = {
        cat: round(total, 2) 
        for cat, total in totals_by_category.items()
    }
    overall_total = round(overall_total, 2)
    
    return jsonify({
        'totals_by_category': totals_by_category,
        'overall_total': overall_total,
        'count': len(expenses)
    }), 200


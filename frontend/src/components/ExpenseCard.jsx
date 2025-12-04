/**
 * ExpenseCard component - Displays a single expense in a card format.
 * Shows expense details and provides delete functionality.
 */
import { getCategoryColor } from '../styles/utils';

const ExpenseCard = ({ expense, onDelete }) => {
  /**
   * Format date for display (YYYY-MM-DD to readable format).
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Format amount as currency.
   */
  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const categoryColor = getCategoryColor(expense.category);

  return (
    <div className="expense-card">
      <div className="expense-card-header">
        <span className="expense-amount">{formatAmount(expense.amount)}</span>
        <span 
          className="category-badge" 
          style={{ backgroundColor: categoryColor }}
        >
          {expense.category}
        </span>
      </div>
      
      <div className="expense-description">{expense.description}</div>
      
      <div className="expense-card-footer">
        <span className="expense-date">{formatDate(expense.date)}</span>
        <button
          className="delete-button"
          onClick={() => onDelete(expense.id)}
          aria-label={`Delete expense: ${expense.description}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;


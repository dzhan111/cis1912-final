/**
 * ExpenseList component - Displays a list of expense cards.
 * Shows empty state when no expenses are available.
 */
import ExpenseCard from './ExpenseCard';

const ExpenseList = ({ expenses, onDelete }) => {
  // Show empty state if no expenses
  if (expenses.length === 0) {
    return (
      <div className="expense-list empty-state">
        <p>No expenses yet. Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ExpenseList;


/**
 * ExpenseForm component - Form for adding new expenses.
 * Handles form input, validation, and submission.
 */
import { useState } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];

const ExpenseForm = ({ onSubmit }) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Today's date
  const [error, setError] = useState('');

  /**
   * Handle form submission.
   * Validates input and calls onSubmit callback.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    const expenseData = {
      amount: amountNum,
      description: description.trim(),
      category,
      date,
    };

    onSubmit(expenseData);

    setAmount('');
    setDescription('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add New Expense</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          type="number"
          id="amount"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you spend on?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;


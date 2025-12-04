/**
 * Main App component - Container for the expense tracker application.
 * Manages state and coordinates between components.
 */
import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryFilter from './components/CategoryFilter';
import SummaryCard from './components/SummaryCard';
import { getExpenses, createExpense, deleteExpense, getSummary } from './services/api';
import './styles/App.css';

function App() {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch expenses from API.
   */
  const fetchExpenses = async (category = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses(category);
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (err) {
      setError('Failed to load expenses. Please check if the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch summary from API.
   */
  const fetchSummary = async (category = null) => {
    try {
      const data = await getSummary(category);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  /**
   * Load expenses and summary on component mount.
   */
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  /**
   * Update expenses and summary when category filter changes.
   */
  useEffect(() => {
    fetchExpenses(selectedCategory);
    fetchSummary(selectedCategory);
  }, [selectedCategory]);

  /**
   * Handle adding a new expense.
   */
  const handleAddExpense = async (expenseData) => {
    try {
      const newExpense = await createExpense(expenseData);
      
      // Refresh expenses list
      await fetchExpenses(selectedCategory);
      await fetchSummary(selectedCategory);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    }
  };

  /**
   * Handle deleting an expense.
   */
  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      
      // Refresh expenses list
      await fetchExpenses(selectedCategory);
      await fetchSummary(selectedCategory);
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error(err);
    }
  };

  /**
   * Handle category filter change.
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
        <p>Track and manage your expenses</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <div className="app-content">
          {/* Left column: Form and Summary */}
          <div className="left-column">
            <ExpenseForm onSubmit={handleAddExpense} />
            <SummaryCard summary={summary} selectedCategory={selectedCategory} />
          </div>

          {/* Right column: Expenses List */}
          <div className="right-column">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            {loading ? (
              <div className="loading">Loading expenses...</div>
            ) : (
              <ExpenseList
                expenses={filteredExpenses}
                onDelete={handleDeleteExpense}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


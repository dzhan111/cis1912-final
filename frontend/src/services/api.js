/**
 * API client for communicating with the backend expense tracker API.
 * Handles all HTTP requests to the Flask backend.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all expenses, optionally filtered by category.
 * @param {string|null} category - Optional category filter
 * @returns {Promise<Array>} Array of expense objects
 */
export const getExpenses = async (category = null) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/api/expenses', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

/**
 * Create a new expense.
 * @param {Object} expenseData - Expense data object
 * @param {number} expenseData.amount - Expense amount
 * @param {string} expenseData.description - Expense description
 * @param {string} expenseData.category - Expense category
 * @param {string} expenseData.date - Expense date (YYYY-MM-DD format)
 * @returns {Promise<Object>} Created expense object
 */
export const createExpense = async (expenseData) => {
  try {
    const response = await api.post('/api/expenses', expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};

/**
 * Delete an expense by ID.
 * @param {number} id - Expense ID to delete
 * @returns {Promise<Object>} Success message
 */
export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/api/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

/**
 * Get expense summary (totals by category and overall total).
 * @param {string|null} category - Optional category filter
 * @returns {Promise<Object>} Summary object with totals
 */
export const getSummary = async (category = null) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/api/expenses/summary', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
};


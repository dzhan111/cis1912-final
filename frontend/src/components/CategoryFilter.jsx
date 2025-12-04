/**
 * CategoryFilter component - Filter buttons for expense categories.
 * Allows filtering expenses by category or showing all expenses.
 */
const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Bills', 'Other'];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-filter">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`filter-button ${selectedCategory === category || 
            (category === 'All' && !selectedCategory) ? 'active' : ''}`}
          onClick={() => onCategoryChange(category === 'All' ? null : category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;


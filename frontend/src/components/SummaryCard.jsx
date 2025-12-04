/**
 * SummaryCard component - Displays expense totals.
 * Shows overall total and totals by category.
 */
const SummaryCard = ({ summary, selectedCategory }) => {
  if (!summary) {
    return null;
  }

  const { overall_total, totals_by_category, count } = summary;

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      
      {selectedCategory ? (
        // Show filtered summary
        <div className="summary-content">
          <div className="summary-item">
            <span className="summary-label">
              {selectedCategory} Total:
            </span>
            <span className="summary-value">
              ${(totals_by_category[selectedCategory] || 0).toFixed(2)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Expenses Count:</span>
            <span className="summary-value">{count}</span>
          </div>
        </div>
      ) : (
        // Show overall summary
        <div className="summary-content">
          <div className="summary-item highlight">
            <span className="summary-label">Total Expenses:</span>
            <span className="summary-value large">
              ${overall_total.toFixed(2)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Count:</span>
            <span className="summary-value">{count}</span>
          </div>
          
          {/* Breakdown by category */}
          {Object.keys(totals_by_category).length > 0 && (
            <div className="category-breakdown">
              <h3>By Category</h3>
              {Object.entries(totals_by_category).map(([category, total]) => (
                <div key={category} className="breakdown-item">
                  <span>{category}:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;


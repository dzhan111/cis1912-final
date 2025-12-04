/**
 * Utility functions for styling.
 */

/**
 * Get color for a category.
 * @param {string} category - Category name
 * @returns {string} Hex color code
 */
export const getCategoryColor = (category) => {
  const colors = {
    Food: '#FF6B6B',           // Red/Orange
    Transport: '#4ECDC4',      // Teal/Blue
    Entertainment: '#95E1D3',  // Light Green/Teal
    Bills: '#F38181',          // Pink/Red
    Other: '#AA96DA',          // Purple
  };
  
  return colors[category] || '#CCCCCC'; // Default gray
};


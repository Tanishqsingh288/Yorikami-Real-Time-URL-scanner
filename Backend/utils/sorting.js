// utils/sorting.js

/**
 * Sorts a user's history based on the given criteria and order.
 * @param {Array} history - User's browsing history array.
 * @param {string} sortBy - Field to sort by ('risk' or 'timestamp').
 * @param {string} order - Sort order ('asc' or 'desc').
 * @returns {Array} - Sorted history array.
 */
function sortHistory(history, sortBy = 'timestamp', order = 'desc') {
  const sorted = [...history]; // Create a shallow copy

  sorted.sort((a, b) => {
    let fieldA, fieldB;

    if (sortBy === 'risk') {
      fieldA = a.finalScore;
      fieldB = b.finalScore;
    } else {
      fieldA = new Date(a.timestamp);
      fieldB = new Date(b.timestamp);
    }

    if (order === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  return sorted;
}

/**
 * Predefined sorting types for convenience
 */
function sortByRiskHighToLow(history) {
  return sortHistory(history, 'risk', 'desc');
}

function sortByRiskLowToHigh(history) {
  return sortHistory(history, 'risk', 'asc');
}

function sortByRecentFirst(history) {
  return sortHistory(history, 'timestamp', 'desc');
}

function sortByOldestFirst(history) {
  return sortHistory(history, 'timestamp', 'asc');
}

module.exports = {
  sortHistory,
  sortByRiskHighToLow,
  sortByRiskLowToHigh,
  sortByRecentFirst,
  sortByOldestFirst
};

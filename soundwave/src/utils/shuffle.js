/**
 * Fisher-Yates shuffle algorithm
 * Creates a shuffled copy of an array
 *
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export function shuffleArray(array) {
  // Create a copy to avoid mutating original
  const shuffled = [...array];

  // Fisher-Yates algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Get random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Create a shuffled version of indices
 * Useful for maintaining original array while playing in random order
 *
 * @param {number} length - Length of array
 * @param {number} currentIndex - Current playing index (to keep it first)
 * @returns {Array} - Array of shuffled indices
 */
export function createShuffledIndices(length, currentIndex = 0) {
  // Create array of indices [0, 1, 2, 3, ...]
  const indices = Array.from({ length }, (_, i) => i);

  // Remove current index
  indices.splice(currentIndex, 1);

  // Shuffle remaining indices
  const shuffled = shuffleArray(indices);

  // Put current index at the start
  return [currentIndex, ...shuffled];
}

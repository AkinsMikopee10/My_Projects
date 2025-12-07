/**
 * Formats seconds into mm:ss format
 *
 * @param {number} seconds - Time in seconds (can be decimal)
 * @returns {string} Formatted time string (e.g., "3:45" or "0:05")
 *
 * Example:
 * formatTime(125) => "2:05"
 * formatTime(65.5) => "1:05"
 * formatTime(3661) => "61:01" (doesn't convert to hours)
 */
export function formatTime(seconds) {
  // If seconds is not a valid number, return "0:00"
  if (isNaN(seconds) || seconds === Infinity) {
    return "0:00";
  }

  // Math.floor rounds down to nearest integer
  // This removes any decimal places
  const mins = Math.floor(seconds / 60);

  // % (modulo) gives us the remainder after division
  // This gives us the seconds part
  const secs = Math.floor(seconds % 60);

  // padStart(2, '0') ensures we always have 2 digits
  // Example: "5" becomes "05"
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

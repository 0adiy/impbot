/**
 * A Promise-based sleep function.
 *
 * @param {number} ms - Time in milliseconds to wait.
 * @returns {Promise} - A Promise that resolves after the specified time.
 */
export function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

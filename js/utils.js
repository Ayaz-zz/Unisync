// utils.js - General Utility Functions

/**
 * Creates a debounced version of a function that delays execution until after
 * 'delay' milliseconds have elapsed since the last time it was invoked.
 * 
 * @param {Function} func - The target function to debounce.
 * @param {number} delay - The delay in milliseconds (e.g., 300ms).
 * @returns {Function} - The debounced wrapper function.
 */
export function debounce(func, delay = 300) {
  let timeoutId;

  return function (...args) {
    // Clear any active timer to reset the delay
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Schedule the execution after the specified delay
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
// utils.js - General Utility Functions

/**
 * Creates a throttled version of a function that only invokes 'func' 
 * at most once per every 'limit' milliseconds.
 * 
 * @param {Function} func - The target function to throttle.
 * @param {number} limit - The time window in milliseconds (e.g., 500ms).
 * @returns {Function} - The throttled wrapper function.
 */
export function throttle(func, limit = 500) {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      // Execute function immediately on the first call
      func.apply(this, args);
      inThrottle = true;

      // Lock further executions until the limit window passes
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
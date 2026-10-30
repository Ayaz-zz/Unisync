// js/storage.js
export const STORAGE_KEY = "uniSyncCourses";
export const TIMESTAMP_KEY = "uniSyncTimestamp";

// TTL set to 30 seconds for demonstration purposes
const CACHE_TTL = 30 * 1000; 

export function loadCourses(defaultCourses) {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) return defaultCourses;
  try {
    return JSON.parse(cached);
  } catch (e) {
    console.error("Error parsing storage cache:", e);
    return defaultCourses;
  }
}

export function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
}

// Check if cache is still fresh based on TTL
export function isCacheValid() {
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);
  if (!timestamp) return false;
  
  const age = Date.now() - Number(timestamp);
  return age < CACHE_TTL;
}
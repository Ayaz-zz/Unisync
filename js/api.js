// js/api.js
import { loadCourses } from "./storage.js";

let activeController = null;

// Helper for exponential backoff retries
async function fetchWithRetry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error; // Do not retry aborted requests
    }
    if (retries <= 0) throw error;
    
    console.warn(`Network glitch. Retrying in ${delay}ms...`);
    await new Promise(res => setTimeout(res, delay));
    return fetchWithRetry(fn, retries - 1, delay * 2);
  }
}

export function fetchCoursesFromDatabase() {
  // Cancel any existing pending fetch request
  if (activeController) {
    activeController.abort();
  }
  
  activeController = new AbortController();
  const signal = activeController.signal;

  const mockApiCall = () => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        if (!navigator.onLine) {
          reject(new Error("No internet connection"));
          return;
        }

        // Base mock server courses
        const serverCourses = [
          { id: 1, code: "CSE1001", completed: true },
          { id: 2, code: "ECE2002", completed: true },
          { id: 3, code: "MAT1002", completed: false },
          { id: 4, code: "PHY1001", completed: false }
        ];

        // Merge with local storage state
        const localCourses = loadCourses([]);
        if (localCourses.length > 0) {
          const mergedCourses = serverCourses.map(serverCourse => {
            const localMatch = localCourses.find(c => c.code.toUpperCase() === serverCourse.code.toUpperCase());
            if (localMatch) {
              return { ...serverCourse, id: localMatch.id, completed: localMatch.completed };
            }
            return serverCourse;
          });

          const serverCodes = serverCourses.map(c => c.code.toUpperCase());
          const userAddedCourses = localCourses.filter(c => !serverCodes.includes(c.code.toUpperCase()));
          
          resolve([...mergedCourses, ...userAddedCourses]);
          return;
        }

        resolve(serverCourses);
      }, 1200);

      // Handle signal abort event inside promise
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  };

  return fetchWithRetry(mockApiCall);
}
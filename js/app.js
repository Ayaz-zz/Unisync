
// js/app.js
import './utils.js';
import { fetchCoursesFromDatabase } from "./api.js";
import { renderCourseList, showOfflineBanner } from "./ui.js";
import { loadCourses, saveCourses, isCacheValid } from "./storage.js";
import { debounce } from "./utils.js";
import { throttle } from "./utils.js";

const defaultCourses = [
  { id: 1726918800000, code: "CSE1001", completed: false },
  { id: 1726918900000, code: "ECE2002", completed: true },
  { id: 1726919000000, code: "MAT1002", completed: false }
];

let courses = loadCourses(defaultCourses);

// DOM Elements
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const courseList = document.getElementById("courseList");
const addCourseForm = document.getElementById("addCourseForm");
const newCourseInput = document.getElementById("newCourseInput");
const errorMessage = document.getElementById("errorMessage");

// Event Listeners
if (searchInput) searchInput.addEventListener("input", updateUI);
if (sortSelect) sortSelect.addEventListener("change", updateUI);

if (addCourseForm) {
  addCourseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawInput = newCourseInput.value.trim();
    
    if (!rawInput || rawInput.length < 4 || rawInput.length > 10) {
      errorMessage.textContent = "Course code must be between 4 and 10 characters.";
      return;
    }
    
    errorMessage.textContent = "";
    const newCourse = {
      id: Date.now(),
      code: rawInput.toUpperCase(),
      completed: false
    };

    courses.push(newCourse);
    saveCourses(courses);
    newCourseInput.value = "";
    updateUI();
  });
}

function getProcessedCourses() {
  const activeTab = document.querySelector(".tab.active")?.dataset.tab || "all";
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const sortOption = sortSelect ? sortSelect.value : "newest";

  let result = courses.filter(item => {
    if (activeTab === "completed") return item.completed;
    if (activeTab === "pending") return !item.completed;
    return true;
  });

  if (searchQuery) {
    result = result.filter(item => item.code.toLowerCase().includes(searchQuery));
  }

  return [...result].sort((a, b) => {
    if (sortOption === "az") return a.code.localeCompare(b.code);
    if (sortOption === "za") return b.code.localeCompare(a.code);
    if (sortOption === "oldest") return a.id - b.id;
    return b.id - a.id;
  });
}

function updateUI() {
  renderCourseList(courseList, getProcessedCourses(), toggleCourse, deleteCourse);
}

function toggleCourse(id) {
  courses = courses.map(course => course.id === id ? { ...course, completed: !course.completed } : course);
  saveCourses(courses);
  updateUI();
}

function deleteCourse(id) {
  courses = courses.filter(course => course.id !== id);
  saveCourses(courses);
  updateUI();
}

// SWR Initialization
async function initializeApp() {
  updateUI(); // Stale render first
  if (isCacheValid()) {
    console.log("Cache is fresh. Skipping background revalidation.");
    return;
  }

  try {
    const serverCourses = await fetchCoursesFromDatabase();
    courses = serverCourses;
    saveCourses(courses);
    updateUI(); // Revalidate render
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch request superseded by a newer action.");
      return;
    }
    console.error("Background revalidation failed:", error);
    showOfflineBanner(true);
    setTimeout(() => showOfflineBanner(false), 3000);
  }
}
function handleToggle(id) {
  console.log("Toggle course status for ID:", id);
  // We will wire this up fully next, but this prevents the crash!
}

function handleDelete(id) {
  console.log("Delete course for ID:", id);
  // We will wire this up fully next, but this prevents the crash!
}
// Search handler function
function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  console.log(`[Debounced Search] Filtering courses for: "${query}"`);
  
  const allCourses = loadCourses() || [];
  const filteredCourses = allCourses.filter(course => 
    course.code.toLowerCase().includes(query)
  );
  
 // Get your container element (e.g., the element with id "courseList")
const courseListContainer = document.getElementById("courseList");

// Then call renderCourseList with all expected arguments:
renderCourseList(courseListContainer, filteredCourses, handleToggle, handleDelete);
}

// Wrap the search function with a 300ms debounce delay
const debouncedSearchHandler = debounce(handleSearch, 300);

// Attach event listener to search input
if (searchInput) {
  searchInput.addEventListener("input", debouncedSearchHandler);
}
function handleResize() {
  console.log(`[Throttled Resize] Window width: ${window.innerWidth}px`);
}

// Wrap with throttle (fires at most once every 1000ms / 1 second)
const throttledResize = throttle(handleResize, 1000);

// Attach event listener
window.addEventListener("resize", throttledResize);

initializeApp();
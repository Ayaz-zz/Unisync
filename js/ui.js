// js/ui.js
export function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderCourseList(container, courses, onToggle, onDelete) {
  if (!container) return;

  if (courses.length === 0) {
    container.innerHTML = "<p>No courses found matching your criteria.</p>";
    return;
  }

  container.innerHTML = courses.map(course => `
    <div class="course-card ${course.completed ? 'completed' : ''}">
      <h3>${escapeHTML(course.code)}</h3>
      <div>
        <button class="toggle-btn" data-id="${course.id}">
          ${course.completed ? 'Mark Pending' : 'Mark Complete'}
        </button>
        <button class="delete-btn" data-id="${course.id}">Delete</button>
      </div>
    </div>
  `).join("");

  // Attach dynamic event listeners safely via delegation or direct binding
  container.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => onToggle(Number(btn.dataset.id)));
  });

  container.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => onDelete(Number(btn.dataset.id)));
  });
}

export function showOfflineBanner(show) {
  const offlineBanner = document.getElementById("offlineBanner");
  if (offlineBanner) {
    offlineBanner.style.display = show ? "block" : "none";
  }
}
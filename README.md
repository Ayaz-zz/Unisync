#  UniSync — Smart Campus & Course Management System

> A production-grade, modular JavaScript application designed for efficient campus course tracking, state persistence, performance optimization, and global error telemetry.

 **Live Demo:** [https://ayaz-zz.github.io/Unisync/](https://ayaz-zz.github.io/Unisync/)

---

##  Project Overview

UniSync is a lightweight, responsive course management tool built using modern vanilla JavaScript (ES6 Modules). It provides students with real-time course filtering, state caching, offline-first capabilities, and enterprise-style error telemetry—all without relying on heavy frontend frameworks.

---

##  Tech Stack & Key Concepts

* **Frontend:** HTML5, CSS3, JavaScript (ES6+ Modules)
* **Hosting & Deployment:** GitHub Pages
* **State Management & Caching:** Browser `localStorage` API
* **Telemetry & Logging:** ISO 8601 UTC timestamps with global error listeners

---

##  Architecture & Key Features

###  Modular Design Pattern
The codebase follows strict separation of concerns across ES6 modules:
* `js/app.js` — Application entry point and event listener coordination.
* `js/utils.js` — Core utility functions (debounce, throttle, error telemetry).
* `js/storage.js` — `localStorage` abstraction layer and cache validation logic.
* `js/api.js` — Asynchronous data fetching abstractions.
* `js/ui.js` — DOM manipulation and dynamic rendering methods.

###  Performance Optimization
* **Debounced Search:** Implemented custom debouncing on input fields to minimize unnecessary execution cycles during live search queries.
* **Throttled Events:** Applied custom event throttling to high-frequency browser events (e.g., window resizing) to maintain high visual frame rates.

###  Runtime Telemetry & Error Logging
* **Global Handlers:** Utilizes `window.onerror` and `window.onunhandledrejection` to catch synchronous runtime bugs and async Promise failures automatically.
* **ISO 8601 Logging:** Formats error telemetry with standardized `new Date().toISOString()` UTC timestamps.
* **Local Telemetry Cache:** Persists up to 10 latest runtime errors directly in `localStorage` (`unisync_error_logs`) for seamless client-side debugging.

---

##  Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ayaz-zz/Unisync.git](https://github.com/Ayaz-zz/Unisync.git)
# Interactive To-Do List with LocalStorage

## Overview

TaskFlow is a modern, minimalist, and responsive To-Do List web application built for **InternCircle Web Development (Task 03)**. The application allows users to create, organize, filter, and track daily tasks with automatic data persistence powered by browser `LocalStorage`.

## Features

- **Add Tasks**: Create new tasks effortlessly using the text input and "Add Task" button.
- **Enter-Key Task Creation**: Submit tasks quickly by pressing the <kbd>Enter</kbd> key inside the input field.
- **Input Validation**: Prevents empty or whitespace-only submissions with accessible validation feedback.
- **Mark as Completed**: Toggle task completion with custom styled checkboxes and instant visual strike-through feedback.
- **Delete Tasks**: Remove individual tasks with a dedicated delete button.
- **Status Filtering**: Filter tasks seamlessly between **All**, **Active**, and **Completed** views without altering underlying data.
- **Dynamic Task Counter**: Automatically displays the number of remaining active tasks (e.g., *"3 tasks remaining"*, *"1 task remaining"*, or *"No tasks remaining"*).
- **Clear Completed**: Remove all completed tasks in one click (safely disabled when there are no completed tasks).
- **LocalStorage Persistence**: Task list state is serialized and persisted in `localStorage` under the key `interncircle-tasks`, surviving page refreshes and browser restarts.
- **Empty State Views**: Context-aware empty state messages customized for each active filter.
- **Responsive Design**: Fluid layout tailored for small mobile (320px, 375px, 425px), tablet (768px), and desktop screens (1024px, 1280px, 1440px).
- **Accessibility & Safety**: Built with semantic HTML5, ARIA attributes, keyboard accessibility, and safe DOM manipulation (preventing XSS injection).

## Technologies

- **HTML5**: Semantic document structure (`<header>`, `<main>`, `<section>`, `<form>`, `<footer>`).
- **CSS3**: Custom properties (CSS variables), Flexbox, CSS Grid, media queries, and accessible focus styles.
- **Vanilla JavaScript (ES6+)**: Modular IIFE, state-driven rendering, DOM manipulation, and event listener delegation.
- **Browser LocalStorage**: Persistent client-side JSON storage with error handling.

## How It Works

1. **State-Driven Architecture**: All tasks and the active filter status are maintained in an in-memory JavaScript state object.
2. **Safe Dynamic DOM Manipulation**: The UI is generated dynamically from state using `document.createElement()`, `appendChild()`, and `textContent` rather than unsafe HTML string concatenation.
3. **LocalStorage Synchronization**: Any state mutation (adding, toggling, deleting, clearing) automatically synchronizes with browser `localStorage` using `JSON.stringify()`.
4. **App Initialization**: On page load, `localStorage` is safely parsed with `JSON.parse()` within a `try/catch` block to restore existing tasks.
5. **Real-Time Filtering**: The active filter dictates which tasks are extracted from the main state array and rendered to the DOM, preserving the full task list.

## How to Run

### Direct Browser Opening
Open `Task-03/index.html` directly in any modern web browser:
- Double-click `index.html` from File Explorer, or
- Right-click and choose **Open with > Chrome / Edge / Firefox / Safari**.

### Local HTTP Server
Alternatively, serve the directory using a lightweight HTTP server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js npx
npx serve .
```
Then navigate to `http://localhost:8000/Task-03/` in your browser.

## Task Requirements Covered

| Requirement | Implementation Details |
| :--- | :--- |
| **DOM Manipulation** | Pure JavaScript methods (`createElement`, `classList`, `appendChild`, `textContent`) used to create and update elements dynamically. |
| **Event Listeners** | Clean `addEventListener()` usage for `submit`, `input`, `click`, and `change` events with zero inline HTML handler attributes. |
| **LocalStorage** | Full persistence under key `interncircle-tasks` with corrupted data protection and automatic JSON serialization. |
| **State Handling** | Unidirectional data flow where UI is a pure projection of the JavaScript state. |
| **Responsive Design** | Custom media queries and fluid layouts tested across 320px, 375px, 425px, 768px, 1024px, 1280px, and 1440px widths. |

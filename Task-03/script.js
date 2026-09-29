/**
 * TaskFlow - Interactive To-Do List with LocalStorage
 * InternCircle Web Development - Task 03
 *
 * Core JavaScript implementation demonstrating:
 * - State-driven application architecture
 * - Pure DOM manipulation & event handling (no unsafe innerHTML for user input)
 * - Robust LocalStorage persistence & error handling
 * - Task status filtering & responsive counter calculation
 */

(function () {
  'use strict';

  // ==========================================================================
  // Constants & State
  // ==========================================================================
  const STORAGE_KEY = 'interncircle-tasks';

  /**
   * Application state
   * @type {{ tasks: Array<{ id: string, text: string, completed: boolean, createdAt: number }>, currentFilter: 'all' | 'active' | 'completed' }}
   */
  const state = {
    tasks: [],
    currentFilter: 'all',
  };

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskValidationError = document.getElementById('task-validation-error');
  const taskList = document.getElementById('task-list');
  const taskCounter = document.getElementById('task-counter');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const emptyState = document.getElementById('empty-state');
  const emptyHeading = document.getElementById('empty-heading');
  const emptySubtext = document.getElementById('empty-subtext');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // ==========================================================================
  // LocalStorage Helpers
  // ==========================================================================

  /**
   * Loads tasks from LocalStorage safely with validation and fallback.
   * @returns {Array} Array of valid task objects
   */
  function loadTasksFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Validate items shape
        return parsed.filter(item => (
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.text === 'string' &&
          typeof item.completed === 'boolean'
        ));
      }
      return [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  }

  /**
   * Saves current tasks state to LocalStorage safely.
   */
  function saveTasksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }

  // ==========================================================================
  // State Mutations & Handlers
  // ==========================================================================

  /**
   * Adds a new task to state, saves, and updates the UI.
   * @param {string} text - Raw task description text
   */
  function addTask(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      showValidationError('Please enter a task description.');
      return;
    }

    clearValidationError();

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
    };

    state.tasks.unshift(newTask);
    saveTasksToStorage();
    render();

    taskInput.value = '';
    taskInput.focus();
  }

  /**
   * Toggles completion status of a specific task.
   * @param {string} taskId
   */
  function toggleTaskCompletion(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasksToStorage();
      render();
    }
  }

  /**
   * Deletes a specific task from state.
   * @param {string} taskId
   */
  function deleteTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveTasksToStorage();
    render();
  }

  /**
   * Clears all completed tasks from state.
   */
  function clearCompletedTasks() {
    const hasCompleted = state.tasks.some(t => t.completed);
    if (!hasCompleted) return;

    state.tasks = state.tasks.filter(t => !t.completed);
    saveTasksToStorage();
    render();
  }

  /**
   * Updates current filter and re-renders the UI.
   * @param {'all' | 'active' | 'completed'} filter
   */
  function setFilter(filter) {
    if (state.currentFilter === filter) return;

    state.currentFilter = filter;

    filterTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-filter') === filter;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    render();
  }

  // ==========================================================================
  // Validation UI Helpers
  // ==========================================================================

  function showValidationError(message) {
    taskValidationError.textContent = message;
    taskValidationError.classList.add('active');
    taskInput.classList.add('input-error');
    taskInput.focus();
  }

  function clearValidationError() {
    taskValidationError.textContent = '';
    taskValidationError.classList.remove('active');
    taskInput.classList.remove('input-error');
  }

  // ==========================================================================
  // Render & DOM Generation
  // ==========================================================================

  /**
   * Returns tasks filtered by the current filter state.
   * @returns {Array} Filtered tasks
   */
  function getFilteredTasks() {
    switch (state.currentFilter) {
      case 'active':
        return state.tasks.filter(t => !t.completed);
      case 'completed':
        return state.tasks.filter(t => t.completed);
      case 'all':
      default:
        return state.tasks;
    }
  }

  /**
   * Creates a single task DOM element using safe DOM methods.
   * @param {{ id: string, text: string, completed: boolean }} task
   * @returns {HTMLLIElement}
   */
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');
    li.setAttribute('data-id', task.id);

    // Left container (checkbox + label)
    const taskLeft = document.createElement('div');
    taskLeft.className = 'task-left';

    // Checkbox wrapper
    const checkboxWrapper = document.createElement('label');
    checkboxWrapper.className = 'task-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'completed'}`);

    checkbox.addEventListener('change', () => {
      toggleTaskCompletion(task.id);
    });

    checkboxWrapper.appendChild(checkbox);

    // Task text (using textContent to prevent unsafe HTML injection)
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Allow clicking text to toggle completion
    taskText.addEventListener('click', () => {
      toggleTaskCompletion(task.id);
    });

    taskLeft.appendChild(checkboxWrapper);
    taskLeft.appendChild(taskText);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'task-delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);

    // SVG icon for delete
    const deleteSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    deleteSvg.setAttribute('width', '18');
    deleteSvg.setAttribute('height', '18');
    deleteSvg.setAttribute('viewBox', '0 0 24 24');
    deleteSvg.setAttribute('fill', 'none');
    deleteSvg.setAttribute('stroke', 'currentColor');
    deleteSvg.setAttribute('stroke-width', '2');
    deleteSvg.setAttribute('stroke-linecap', 'round');
    deleteSvg.setAttribute('stroke-linejoin', 'round');
    deleteSvg.setAttribute('aria-hidden', 'true');

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '18');
    line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '6');
    line1.setAttribute('y2', '18');

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '6');
    line2.setAttribute('y1', '6');
    line2.setAttribute('x2', '18');
    line2.setAttribute('y2', '18');

    deleteSvg.appendChild(line1);
    deleteSvg.appendChild(line2);
    deleteBtn.appendChild(deleteSvg);

    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    li.appendChild(taskLeft);
    li.appendChild(deleteBtn);

    return li;
  }

  /**
   * Updates task counter and clear completed button state.
   */
  function updateSummaryBar() {
    const activeCount = state.tasks.filter(t => !t.completed).length;
    const completedCount = state.tasks.filter(t => t.completed).length;

    // Counter text
    if (activeCount === 0) {
      taskCounter.textContent = 'No tasks remaining';
    } else if (activeCount === 1) {
      taskCounter.textContent = '1 task remaining';
    } else {
      taskCounter.textContent = `${activeCount} tasks remaining`;
    }

    // Clear completed button state
    clearCompletedBtn.disabled = completedCount === 0;
  }

  /**
   * Updates the empty state container based on current filter and tasks count.
   * @param {number} filteredCount
   */
  function updateEmptyState(filteredCount) {
    if (filteredCount === 0) {
      emptyState.classList.add('active');
      taskList.style.display = 'none';

      if (state.tasks.length === 0) {
        emptyHeading.textContent = 'No tasks yet';
        emptySubtext.textContent = 'Add your first task above to start organizing your day.';
      } else if (state.currentFilter === 'active') {
        emptyHeading.textContent = 'No active tasks';
        emptySubtext.textContent = 'All your tasks are completed! Excellent job.';
      } else if (state.currentFilter === 'completed') {
        emptyHeading.textContent = 'No completed tasks';
        emptySubtext.textContent = 'Complete a task to see it listed here.';
      } else {
        emptyHeading.textContent = 'No tasks found';
        emptySubtext.textContent = 'Try switching to another filter tab.';
      }
    } else {
      emptyState.classList.remove('active');
      taskList.style.display = 'block';
    }
  }

  /**
   * Master render function to sync UI with state.
   */
  function render() {
    const filteredTasks = getFilteredTasks();

    // Clear current list items
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }

    // Append dynamic task elements
    const fragment = document.createDocumentFragment();
    filteredTasks.forEach(task => {
      const taskEl = createTaskElement(task);
      fragment.appendChild(taskEl);
    });
    taskList.appendChild(fragment);

    // Update empty state
    updateEmptyState(filteredTasks.length);

    // Update counters and controls
    updateSummaryBar();
  }

  // ==========================================================================
  // Event Listeners Setup
  // ==========================================================================
  function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTask(taskInput.value);
    });

    // Clear validation error on typing
    taskInput.addEventListener('input', function () {
      if (taskValidationError.classList.contains('active')) {
        clearValidationError();
      }
    });

    // Filter tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Clear completed button
    clearCompletedBtn.addEventListener('click', function () {
      clearCompletedTasks();
    });
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    setupEventListeners();
    state.tasks = loadTasksFromStorage();
    render();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

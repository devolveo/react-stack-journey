const { version } = require("react");

// Todo App - JavaScript Functionality
console.log("Todo App initializing...");

// App Configuration
const APP_CONFIG = {
  STORAGE_KEY: "todoApp_tasks",
  MAX_TASK_LENGTH: 100,
  MAX_TASKS: 1000,
  version: "1.0.0",
};

// App State (YOUR SYSTEMATIC DESIGN!)
let appState = {
  tasks: [], // Core data array
  isError: false, // Error state tracking
  filterBy: "all", // Current filter: 'all', 'pending', 'completed'
  isLoading: false, // Loading state
};

// Task Structure (based on your Step 1 analysis)
const createTask = (text) => {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
};

// DOM Elements Cache (unchanged)
const elements = {
  taskInput: document.getElementById("task-input"),
  addBtn: document.getElementById("add-btn"),

  totalTasks: document.getElementById("total-tasks"),
  pendingCount: document.getElementById("pending-count"),
  doneCount: document.getElementById("done-count"),

  filterPending: document.getElementById("filter-pending"),
  filterCompleted: document.getElementById("filter-completed"),
  filterAll: document.getElementById("filter-all"),

  emptyState: document.getElementById("empty-state"),
  taskList: document.getElementById("task-list"),
};

// Initialize app when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing todo app...");
  initializeApp();
});

function initializeApp() {
  console.log("App initializing with your systematic design...");
  console.log("Initial state:", appState);

  // Step 1: Load saved tasks from localStorage
  loadTasksFromStorage();

  // Step 2: Set up event listeners (YOUR USER FLOW!)
  setupEventListeners();

  // Step 3: Render initial UI state
  renderApp();

  console.log("App ready!");
}

// Event Listeners Setup
function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Step 4 from your flow: Add button click OR Enter key
  elements.addBtn.addEventListener("click", handleAddTask);
  elements.taskInput.addEventListener("keydown", handleEnterKey);

  // Filter button clicks (from your Step 2 analysis)
  elements.filterPending.addEventListener("click", () =>
    handleFilterChange("pending")
  );
  elements.filterCompleted.addEventListener("click", () =>
    handleFilterChange("completed")
  );
  elements.filterAll.addEventListener("click", () => handleFilterChange("all"));

  console.log("Event listeners attached!");
}

// Step 4: Handle Add Task (your core user flow!)
function handleAddTask() {
  const taskText = elements.taskInput.value.trim();

  console.log("Add task clicked:", taskText);

  if (!taskText) {
    console.log("Empty task, ignoring");
    return;
  }

  if (taskText.length > APP_CONFIG.MAX_TASK_LENGTH) {
    console.log("Task too long, ignoring");
    return;
  }

  // Step 5: Add to your systematic state!
  const newTask = createTask(taskText);
  appState.tasks.push(newTask);

  // Clear input (Step 5 from your flow)
  elements.taskInput.value = "";

  // Step 6: Save to localStorage
  saveTasksToStorage();

  // Step 5: Update UI to show new task
  renderApp();

  console.log("Task added:", newTask);
  console.log("Updated state:", appState);
}

// Handle Enter key (Step 4 alternative)
function handleEnterKey(event) {
  if (event.key === "Enter") {
    handleAddTask();
  }
}

// Handle Filter Changes (from your analysis)
function handleFilterChange(newFilter) {
  console.log("Filter changed to:", newFilter);

  appState.filterBy = newFilter;
  renderApp();
}

// Placeholder functions (we'll implement these next)
function loadTasksFromStorage() {
  console.log("TODO: Load from localStorage");
}

function saveTasksToStorage() {
  console.log("TODO: Save to localStorage");
}

function renderApp() {
  console.log("TODO: Render UI");
  console.log("Current state:", appState);
}

// Step 6 & 7: localStorage Implementation (YOUR USER FLOW!)
function saveTasksToStorage() {
  try {
    console.log("Saving tasks to localStorage...");

    const dataToSave = {
      tasks: appState.tasks,
      filterBy: appState.filterBy, // Save filter preference too!
      savedAt: Date.now(),
    };

    localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
    console.log("Tasks saved successfully:", dataToSave);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    appState.isError = true;
  }
}

function loadTasksFromStorage() {
  try {
    console.log("Loading tasks from localStorage...");

    const savedData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);

    if (!savedData) {
      console.log("No saved tasks found - starting fresh");
      return;
    }

    const parsedData = JSON.parse(savedData);

    // Step 7: Load saved data into your systematic state!
    if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
      appState.tasks = parsedData.tasks;
      console.log("Loaded tasks:", appState.tasks);
    }

    if (parsedData.filterBy) {
      appState.filterBy = parsedData.filterBy;
      console.log("Loaded filter preference:", appState.filterBy);
    }

    console.log("Successfully loaded from localStorage");
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    appState.isError = true;
    // Continue with empty state - graceful degradation
  }
}

// Update renderApp to show basic state info
function renderApp() {
  console.log("=== RENDERING APP ===");

  // Calculate display values (from your systematic design!)
  const totalTasks = appState.tasks.length;
  const pendingCount = appState.tasks.filter((t) => !t.completed).length;
  const doneCount = appState.tasks.filter((t) => t.completed).length;

  console.log("Rendering stats:", {
    totalTasks,
    pendingCount,
    doneCount,
    filter: appState.filterBy,
  });

  // Update counters in UI
  elements.totalTasks.textContent = totalTasks;
  elements.pendingCount.textContent = pendingCount;
  elements.doneCount.textContent = doneCount;

  // Update filter button active states
  updateFilterButtons();

  // Render task list based on current filter
  renderTaskList();

  console.log("=== RENDER COMPLETE ===");
}

// Update filter button active states
function updateFilterButtons() {
  // Remove active class from all
  elements.filterPending.classList.remove("active");
  elements.filterCompleted.classList.remove("active");
  elements.filterAll.classList.remove("active");

  // Add active class to current filter
  if (appState.filterBy === "pending") {
    elements.filterPending.classList.add("active");
  } else if (appState.filterBy === "completed") {
    elements.filterCompleted.classList.add("active");
  } else {
    elements.filterAll.classList.add("active");
  }
}

// Render the actual task list (Step 5: User sees tasks!)
function renderTaskList() {
  console.log("Rendering task list with filter:", appState.filterBy);

  // Filter tasks based on current filter (from your systematic design!)
  const visibleTasks = getVisibleTasks();

  console.log(
    "Visible tasks:",
    visibleTasks.length,
    "of",
    appState.tasks.length
  );

  // Show/hide empty state
  if (visibleTasks.length === 0) {
    elements.emptyState.style.display = "block";
    elements.taskList.style.display = "none";
  } else {
    elements.emptyState.style.display = "none";
    elements.taskList.style.display = "block";
  }

  // Sort tasks: pending first, then completed (from your wireframe!)
  const sortedTasks = sortTasks(visibleTasks);

  // Generate HTML for all tasks
  elements.taskList.innerHTML = sortedTasks
    .map((task) => createTaskHTML(task))
    .join("");

  // Attach event listeners to new task elements
  attachTaskEventListeners();
}

// Get visible tasks based on filter (your systematic design!)
function getVisibleTasks() {
  if (appState.filterBy === "pending") {
    return appState.tasks.filter((task) => !task.completed);
  } else if (appState.filterBy === "completed") {
    return appState.tasks.filter((task) => task.completed);
  } else {
    return appState.tasks; // 'all'
  }
}

// Sort tasks: pending first, completed last (from your wireframe!)
function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    // Pending tasks first, completed tasks last
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    // Within same status, newest first
    return b.createdAt - a.createdAt;
  });
}

// Create HTML for individual task (from your HTML blueprint!)
function createTaskHTML(task) {
  return `
    <div class="task-item ${task.completed ? "completed" : ""}" data-task-id="${
    task.id
  }">
      <label class="task-checkbox-container">
        <input type="checkbox" class="task-checkbox" ${
          task.completed ? "checked" : ""
        }>
        <span class="task-text">${escapeHtml(task.text)}</span>
      </label>
      <button class="delete-btn" data-task-id="${task.id}">🗑️</button>
    </div>
  `;
}

// Attach event listeners to task elements
function attachTaskEventListeners() {
  // Toggle complete functionality
  document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", handleToggleComplete);
  });

  // Delete functionality
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", handleDeleteTask);
  });
}

// Handle toggle complete (from your Step 2 analysis!)
function handleToggleComplete(event) {
  const taskItem = event.target.closest(".task-item");
  const taskId = taskItem.dataset.taskId;

  console.log("Toggling task:", taskId);

  // Update in your systematic state!
  const task = appState.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasksToStorage();
    renderApp();
    console.log("Task toggled:", task);
  }
}

// Handle delete task (HARD DELETE from your decision!)
function handleDeleteTask(event) {
  const taskId = event.target.dataset.taskId;

  console.log("Deleting task:", taskId);

  // Hard delete from your systematic state!
  appState.tasks = appState.tasks.filter((task) => task.id !== taskId);

  saveTasksToStorage();
  renderApp();

  console.log("Task deleted, remaining:", appState.tasks.length);
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* ===== Purpose ===== */
//   Save tasks to localStorage
function saveTasksToStorage() {
  console.log("Saving tasks to localStorage...");

  /* ===== Input ===== */
  // - No parameters needed
  // - Reads from global appState.tasks
  // - Edge cases: appState is null/undefined, tasks is not array
  // - Empty array is VALID (user deleted all tasks)
  if (!appState || !Array.isArray(appState.tasks)) {
    console.error("Invalid app state for saving");
    return { success: false, error: "Invalid app state" };
  }

  /* ===== Transform ===== */
  // 1. Read appState.tasks
  // 2. Create data object (tasks + metadata)
  // 3. Convert to JSON string
  // 4. Save to localStorage with key

  const dataToSave = {
    tasks: appState.tasks,
    filteredBy: appState.filterBy,
    createdAt: Date.now(),
    version: APP_CONFIG.version,
  };

  /* ===== Error ===== */
  // - localStorage disabled (private browsing)
  // - localStorage quota exceeded (storage full)
  // - JSON.stringify fails (circular references)
  // - appState.tasks is not an array
  // - Browser doesn't support localStorage
  try {
    const jsonString = JSON.stringify(dataToSave);
    localStorage.setItem(APP_CONFIG.STORAGE_KEY, jsonString);
    console.log("Tasks saved successfully:", appState.tasks.length, " tasks");

    /* ===== Return ===== */
    // Return {success: boolean, error?: string}
    // Why? handleAddTask() needs to know if save failed!
    return { success: true };
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);

    //handle specific  locationStorage Errors
    if (error.name === "QuotaExceededError") {
      return { success: false, error: "Storage quota exceeded" };
    } else if (error.name === "SecurityError") {
      return { success: false, error: "localStorage disabled" };
    } else {
      return { success: false, error: "Save failed: " + error.message };
    }
  }
}

// ===== COMPLETE PROFESSIONAL loadTasksFromStorage() =====
function loadTasksFromStorage() {
  console.log("=== LOADING TASKS FROM STORAGE ===");

  let rawData;
  try {
    rawData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
  } catch (error) {
    console.warn("localStorage not available:", error);
    return {
      success: false,
      error: {
        type: "STORAGE_DISABLED",
        message: "Browser storage not available",
        recoverable: false,
      },
      metadata: {
        dataVersion: "unknown",
        migrationPerformed: false,
        loadTime: Date.now(),
      },
    };
  }

  if (!rawData) {
    console.log("No saved data found - first time user");
    return {
      success: true,
      data: null,
      metadata: {
        loadedFrom: "default",
        dataVersion: "none",
        migrationPerformed: false,
        loadTime: Date.now(),
      },
    };
  }

  let parsedData;
  try {
    parsedData = JSON.parse(rawData);
  } catch (error) {
    console.warn("Corrupted data detected, clearing storage:", error);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
    return {
      success: false,
      error: {
        type: "CORRUPTED_DATA",
        message: "Saved data was corrupted",
        recoverable: true,
      },
      metadata: {
        dataVersion: "corrupted",
        migrationPerformed: false,
        loadTime: Date.now(),
      },
    };
  }

  let formatType;
  let normalizedData;
  let migrationPerformed = false;

  if (Array.isArray(parsedData)) {
    console.log("Legacy format detected, migrating...");
    formatType = "legacy";
    normalizedData = {
      tasks: parsedData,
      filterBy: "all",
      savedAt: Date.now(),
      version: "1.0",
    };
    migrationPerformed = true;
  } else if (parsedData && typeof parsedData === "object" && parsedData.tasks) {
    console.log("Current format detected");
    formatType = "current";
    normalizedData = parsedData;
  } else {
    console.warn("Unrecognized data format, clearing storage:", parsedData);
    localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
    return {
      success: false,
      error: {
        type: "INVALID_FORMAT",
        message: "Data format not recognized",
        recoverable: true,
      },
      metadata: {
        dataVersion: "unknown",
        migrationPerformed: false,
        loadTime: Date.now(),
      },
    };
  }

  const stateReadyData = {
    tasks: normalizedData.tasks || [],
    filterBy: normalizedData.filterBy || "all",
  };

  console.log(
    "Data loaded successfully:",
    stateReadyData.tasks.length,
    "tasks"
  );
  return {
    success: true,
    data: stateReadyData,
    metadata: {
      loadedFrom: migrationPerformed ? "migrated" : "localStorage",
      dataVersion: formatType,
      migrationPerformed,
      loadTime: Date.now(),
    },
  };
}

// ===== PROFESSIONAL initializeApp() =====
function initializeApp() {
  console.log("=== APP INITIALIZING ===");

  const loadResult = loadTasksFromStorage();

  if (loadResult.success) {
    if (loadResult.data === null) {
      console.log("New user - using default state");
      appState.tasks = [];
      appState.filterBy = "all";
    } else {
      console.log(
        "Restoring user data:",
        loadResult.data.tasks.length,
        "tasks"
      );
      appState.tasks = loadResult.data.tasks;
      appState.filterBy = loadResult.data.filterBy;

      if (loadResult.metadata.migrationPerformed) {
        console.log("✨ Data migrated from:", loadResult.metadata.dataVersion);
        saveTasksToStorage(); // Save in new format
      }
    }
  } else {
    console.log("Load failed:", loadResult.error.type, "- using default state");
    appState.tasks = [];
    appState.filterBy = "all";
  }

  setupEventListeners();
  renderApp();
  console.log("=== APP READY ===");
}

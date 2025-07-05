// =====================================================
// TODO APP - PROFESSIONAL IMPLEMENTATION
// =====================================================

// =====================================================
// CONFIG & CONSTANTS
// Future: Move to config.js
// =====================================================
const APP_CONFIG = {
  STORAGE_KEY: "todoApp_tasks",
  MAX_TASK_LENGTH: 100,
  MAX_TASKS: 1000,
};

// =====================================================
// STATE MANAGEMENT
// Future: Move to state.js
// =====================================================
let appState = {
  tasks: [],
  isError: false,
  filterBy: "all",
  isLoading: false,
};

// =====================================================
// DOM ELEMENT CACHE
// Future: Move to ui.js
// =====================================================
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

// =====================================================
// APP INITIALIZATION
// Future: Move to app.js
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Todo App initializing...");
  initializeApp();
});

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
        saveTasksToStorage();
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

// =====================================================
// DATA PERSISTENCE LAYER
// Future: Move to storage.js
// =====================================================

function loadTasksFromStorage() {
  console.log("=== LOADING TASKS FROM STORAGE ===");

  // Safe Storage Access
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

  // Handle first time user
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

  // Safe JSON Parsing
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

  // Format Detection & Classification
  let formatType;
  let normalizedData;
  let migrationPerformed = false;

  if (Array.isArray(parsedData)) {
    // Legacy format - just array of tasks
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
    // Current format
    console.log("Current format detected");
    formatType = "current";
    normalizedData = parsedData;
  } else {
    // Unrecognized format
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

  // State Preparation
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

function saveTasksToStorage() {
  try {
    console.log("Saving tasks to localStorage...");

    // Input validation
    if (!appState || !Array.isArray(appState.tasks)) {
      console.error("Invalid app state for saving");
      return { success: false, error: "Invalid app state" };
    }

    // Create save data
    const dataToSave = {
      tasks: appState.tasks,
      filterBy: appState.filterBy,
      savedAt: Date.now(),
      version: "1.0",
    };

    // Save to localStorage
    const jsonString = JSON.stringify(dataToSave);
    localStorage.setItem(APP_CONFIG.STORAGE_KEY, jsonString);

    console.log("Tasks saved successfully:", appState.tasks.length, "tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to save to localStorage:", error);

    if (error.name === "QuotaExceededError") {
      return { success: false, error: "Storage quota exceeded" };
    } else if (error.name === "SecurityError") {
      return { success: false, error: "localStorage disabled" };
    } else {
      return { success: false, error: "Save failed: " + error.message };
    }
  }
}

// =====================================================
// BUSINESS LOGIC
// Future: Move to tasks.js
// =====================================================

function createTask(text) {
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

function validateTaskInput(text) {
  // Type safety
  if (typeof text !== "string") {
    return {
      isValid: false,
      reason: "INVALID_TYPE",
      message: "Input must be a string",
    };
  }

  // Empty input validation
  const trimmedText = text.trim();
  if (!trimmedText) {
    return {
      isValid: false,
      reason: "EMPTY_INPUT",
      message: "Task cannot be empty",
    };
  }

  // Length validation
  if (trimmedText.length > APP_CONFIG.MAX_TASK_LENGTH) {
    return {
      isValid: false,
      reason: "INPUT_TOO_LONG",
      message: `Task must be ${APP_CONFIG.MAX_TASK_LENGTH} characters or less`,
    };
  }

  // Tasks limit validation
  if (appState.tasks.length >= APP_CONFIG.MAX_TASKS) {
    return {
      isValid: false,
      reason: "MAX_TASKS_REACHED",
      message: `Maximum ${APP_CONFIG.MAX_TASKS} tasks allowed`,
    };
  }

  return { isValid: true, reason: "VALID", message: "Input passed validation" };
}

function getVisibleTasks() {
  if (appState.filterBy === "pending") {
    return appState.tasks.filter((task) => !task.completed);
  } else if (appState.filterBy === "completed") {
    return appState.tasks.filter((task) => task.completed);
  } else {
    return appState.tasks;
  }
}

function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    // Pending tasks first, completed tasks last
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    // Within same status, newest first
    return b.createdAt - a.createdAt;
  });
}

// =====================================================
// UI RENDERING
// Future: Move to ui.js
// =====================================================

function renderApp() {
  console.log("=== RENDERING APP ===");

  // Calculate display values
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

function renderTaskList() {
  console.log("Rendering task list with filter:", appState.filterBy);

  // Filter tasks based on current filter
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

  // Sort tasks: pending first, then completed
  const sortedTasks = sortTasks(visibleTasks);

  // Generate HTML for all tasks
  elements.taskList.innerHTML = sortedTasks
    .map((task) => createTaskHTML(task))
    .join("");

  // Attach event listeners to new task elements
  attachTaskEventListeners();
}

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

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// =====================================================
// EVENT HANDLING
// Future: Move to events.js
// =====================================================

function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Task creation
  elements.addBtn.addEventListener("click", handleAddTask);
  elements.taskInput.addEventListener("keydown", handleEnterKey);

  // Filter functionality
  elements.filterPending.addEventListener("click", () =>
    handleFilterChange("pending")
  );
  elements.filterCompleted.addEventListener("click", () =>
    handleFilterChange("completed")
  );
  elements.filterAll.addEventListener("click", () => handleFilterChange("all"));

  console.log("Event listeners attached!");
}

function handleAddTask() {
  console.log("FR-001: Task creation flow initiated");

  const taskText = elements.taskInput.value.trim();

  // Professional validation
  const validationResult = validateTaskInput(taskText);
  if (!validationResult.isValid) {
    console.log("FR-001 Alternative Flow:", validationResult.reason);
    handleInputValidationError(validationResult);
    return;
  }

  // Create and add task
  const newTask = createTask(taskText);
  console.log("FR-001 Step 7: Task object created:", newTask);

  appState.tasks.push(newTask);

  // Save with error handling
  const saveResult = saveTasksToStorage();
  if (!saveResult.success) {
    console.log(
      "FR-001 Alternative Flow 1C: localStorage failed, continuing in-memory"
    );
    appState.isError = true;
  }

  // Clear input and update UI
  elements.taskInput.value = "";
  renderApp();

  console.log("FR-001: Task creation flow completed successfully");
}

function handleInputValidationError(validationResult) {
  console.warn("Input validation failed:", validationResult);

  // Keep focus on input for better UX
  elements.taskInput.focus();

  // Future enhancement: Show user-friendly error message
}

function handleEnterKey(event) {
  if (event.key === "Enter") {
    handleAddTask();
  }
}

function handleFilterChange(newFilter) {
  console.log("Filter changed to:", newFilter);

  appState.filterBy = newFilter;
  renderApp();
}

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

function handleToggleComplete(event) {
  console.log("FR-002: Toggle complete flow initiated");

  const taskItem = event.target.closest(".task-item");
  if (!taskItem) {
    console.error("FR-002 Error: No task item found");
    return;
  }

  const taskId = taskItem.dataset.taskId;
  if (!taskId) {
    console.error("FR-002 Error: No task ID found");
    return;
  }

  // Find and toggle task
  const task = appState.tasks.find((t) => t.id === taskId);
  if (!task) {
    console.error("FR-002 Error: Task not found in state:", taskId);
    return;
  }

  // Toggle completion status
  task.completed = !task.completed;
  console.log("FR-002: Task toggled:", task.id, "completed:", task.completed);

  // Save and render
  const saveResult = saveTasksToStorage();
  if (!saveResult.success) {
    console.warn("FR-002: localStorage save failed, continuing in-memory");
    appState.isError = true;
  }

  renderApp();
  console.log("FR-002: Toggle complete flow finished");
}

function handleDeleteTask(event) {
  const taskId = event.target.dataset.taskId;

  console.log("Deleting task:", taskId);

  // Hard delete from systematic state
  appState.tasks = appState.tasks.filter((task) => task.id !== taskId);

  saveTasksToStorage();
  renderApp();

  console.log("Task deleted, remaining:", appState.tasks.length);
}

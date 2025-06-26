// Multi-Feature Dashboard - Day 5
document.addEventListener("DOMContentLoaded", () => {
  console.log("Interactive Dashboard loaded!");

  // ======================
  // COUNTER FUNCTIONALITY
  // ======================

  let counterState = {
    value: 0,
    step: 1,
    min: -10,
    max: 100,
    clickCount: 0,
  };

  const counterValue = document.getElementById("counter-value");
  const counterPlus = document.getElementById("counter-plus");
  const counterMinus = document.getElementById("counter-minus");
  const counterReset = document.getElementById("counter-reset");
  const counterStep = document.getElementById("counter-step");
  const clickCountDisplay = document.getElementById("click-count");

  const updateCounterDisplay = () => {
    counterValue.textContent = counterState.value;

    if (counterState.value >= counterState.max) {
      counterValue.style.color = "#dc3545";
      counterPlus.disabled = true;
    } else if (counterState.value <= counterState.min) {
      counterValue.style.color = "#dc3545";
      counterMinus.disabled = true;
    } else {
      counterValue.style.color = "#667eea";
      counterPlus.disabled = false;
      counterMinus.disabled = false;
    }

    clickCountDisplay.textContent = counterState.clickCount;
    console.log("Counter updated:", counterState.value);
  };

  const incrementCounter = () => {
    if (counterState.value < counterState.max) {
      counterState.value += counterState.step;
      counterState.clickCount++;
      updateCounterDisplay();
    }
  };

  const decrementCounter = () => {
    if (counterState.value > counterState.min) {
      counterState.value -= counterState.step;
      counterState.clickCount++;
      updateCounterDisplay();
    }
  };

  const resetCounter = () => {
    counterState.value = 0;
    counterState.clickCount++;
    updateCounterDisplay();
    console.log("Counter reset");
  };

  // ======================
  // COLOR PICKER FUNCTIONALITY
  // ======================

  let colorState = {
    currentColor: "#667eea",
    colorChangeCount: 0,
  };

  const colorButtons = document.querySelectorAll(".color-btn");
  const randomColorBtn = document.getElementById("random-color");
  const colorDisplay = document.getElementById("color-display");
  const colorChangesDisplay = document.getElementById("color-changes");

  // Update background color
  const updateBackgroundColor = (color) => {
    document.body.style.background = `linear-gradient(135deg, ${color} 0%, ${darkenColor(
      color,
      20
    )} 100%)`;
    colorState.currentColor = color;
    colorState.colorChangeCount++;

    // Update display
    colorDisplay.textContent = color;
    colorChangesDisplay.textContent = colorState.colorChangeCount;

    // Update active button
    colorButtons.forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-color="${color}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    console.log("Background changed to:", color);
  };

  // Helper function to darken color
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Generate random color
  const generateRandomColor = () => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#74b9ff",
      "#a29bfe",
      "#fd79a8",
      "#e17055",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    updateBackgroundColor(randomColor);
  };

  // Event listeners for counter
  counterPlus.addEventListener("click", incrementCounter);
  counterMinus.addEventListener("click", decrementCounter);
  counterReset.addEventListener("click", resetCounter);

  counterStep.addEventListener("change", (e) => {
    counterState.step = parseInt(e.target.value);
    console.log("Counter step changed to:", counterState.step);
  });

  // Event listeners for colors
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.getAttribute("data-color");
      updateBackgroundColor(color);
    });
  });

  randomColorBtn.addEventListener("click", generateRandomColor);

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
      return;
    }

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        incrementCounter();
        break;
      case "ArrowDown":
        e.preventDefault();
        decrementCounter();
        break;
      case "r":
      case "R":
        resetCounter();
        break;
      case "c":
      case "C":
        generateRandomColor();
        break;
    }
  });

  // Initialize
  updateCounterDisplay();
  updateBackgroundColor(colorState.currentColor);

  //   console.log("Dahboard ready! Counter: ↑/↓ keys, R=reset, C=random color");

  // ======================
  // LOCAL STORAGE FUNCTIONALITY
  // ======================

  const STORAGE_KEY = "dashboard_data";

  // Save data to localStorage (UPDATED)
  const saveToStorage = () => {
    const data = {
      counter: counterState,
      color: colorState,
      theme: themeState,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log("Data saved to localStorage:", data);
  };

  // Load data from localStorage (UPDATED)
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);

        // Restore counter state
        counterState = { ...counterState, ...data.counter };

        // Restore color state
        colorState = { ...colorState, ...data.color };

        // Restore theme state
        if (data.theme) {
          themeState = { ...themeState, ...data.theme };

          // Apply saved theme
          if (themeState.isDark) {
            document.body.classList.add("dark-theme");
            themeToggle.textContent = "☀️ Light Mode";
          }
        }

        console.log("Data loaded from localStorage:", data);
        return true;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    return false;
  };

  // Clear all stored data (UPDATED)
  const clearStoredData = () => {
    localStorage.removeItem(STORAGE_KEY);

    // Reset to defaults
    counterState = { value: 0, step: 1, min: -10, max: 100, clickCount: 0 };
    colorState = { currentColor: "#667eea", colorChangeCount: 0 };
    themeState = { isDark: false };

    // Reset theme to light
    document.body.classList.remove("dark-theme");
    themeToggle.textContent = "🌙 Dark Mode";

    // Update displays
    updateCounterDisplay();
    updateBackgroundColor(colorState.currentColor);

    console.log("All data cleared and reset to defaults");
    alert("All data cleared and reset!");
  };

  // Auto-save when data changes (modify existing functions)
  const incrementCounterWithSave = () => {
    incrementCounter();
    saveToStorage();
  };

  const decrementCounterWithSave = () => {
    decrementCounter();
    saveToStorage();
  };

  const resetCounterWithSave = () => {
    resetCounter();
    saveToStorage();
  };

  const updateBackgroundColorWithSave = (color) => {
    updateBackgroundColor(color);
    saveToStorage();
  };

  // ======================
  // SESSION TIMER
  // ======================

  let sessionStartTime = Date.now();
  const sessionTimeDisplay = document.getElementById("session-time");

  const updateSessionTime = () => {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    if (minutes > 0) {
      sessionTimeDisplay.textContent = `${minutes}m ${seconds}s`;
    } else {
      sessionTimeDisplay.textContent = `${seconds}s`;
    }
  };

  // Update session time every second
  setInterval(updateSessionTime, 1000);

  // ======================
  // EVENT LISTENERS UPDATE (with save functionality)
  // ======================

  // Clear existing listeners and add new ones with save
  counterPlus.removeEventListener("click", incrementCounter);
  counterMinus.removeEventListener("click", decrementCounter);
  counterReset.removeEventListener("click", resetCounter);

  counterPlus.addEventListener("click", incrementCounterWithSave);
  counterMinus.addEventListener("click", decrementCounterWithSave);
  counterReset.addEventListener("click", resetCounterWithSave);

  // Update color listeners
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.getAttribute("data-color");
      updateBackgroundColorWithSave(color);
    });
  });

  randomColorBtn.addEventListener("click", () => {
    generateRandomColor();
    saveToStorage();
  });

  // ======================
  // THEME SWITCHER FUNCTIONALITY
  // ======================

  let themeState = {
    isDark: false,
  };

  const themeToggle = document.getElementById("theme-toggle");

  // Toggle theme function
  const toggleTheme = () => {
    themeState.isDark = !themeState.isDark;

    if (themeState.isDark) {
      document.body.classList.add("dark-theme");
      themeToggle.textContent = "☀️ Light Mode";
      console.log("Switched to dark theme");
    } else {
      document.body.classList.remove("dark-theme");
      themeToggle.textContent = "🌙 Dark Mode";
      console.log("Switched to light theme");
    }

    // Save theme preference
    saveToStorage();
  };

  themeToggle.addEventListener("click", toggleTheme);

  // Clear data button
  const clearDataBtn = document.getElementById("clear-data");
  clearDataBtn.addEventListener("click", clearStoredData);

  // ======================
  // INITIALIZATION
  // ======================

  // Load saved data first
  const hasStoredData = loadFromStorage();

  // Update displays with loaded or default data
  updateCounterDisplay();
  updateBackgroundColor(colorState.currentColor);

  if (hasStoredData) {
    console.log("Welcome back! Your data was restored.");
  } else {
    console.log("Welcome! Starting fresh.");
  }

  console.log("Dashboard ready! Counter: ↑/↓ keys, R=reset, C=random color");
  console.log("Your preferences are automatically saved!");
});

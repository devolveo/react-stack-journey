document.addEventListener("DOMContentLoaded", () => {
  console.log("Weather App initialized");

  const API_KEY = "28b0548959eb81c0d190e0f96d67678b";
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  //DOM ELements
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("btn-search");
  const locationBtn = document.getElementById("btn-location");

  //state section
  const loadingSection = document.getElementById("loading");
  const errorSection = document.getElementById("error");
  const currentWeatherSection = document.getElementById("current-weather");
  const forecastSection = document.getElementById("forecast");

  console.log("All elements loaded: ", {
    cityInput: !!cityInput,
    searchBtn: !!searchBtn,
    locationBtn: !!locationBtn,
    loadingSection: !!loadingSection,
    errorSection: !!errorSection,
    currentWeatherSection: !!currentWeatherSection,
  });

  searchBtn.addEventListener("click", handleSeach);
  locationBtn.addEventListener("click", handleLocationSearch);

  //enter key support for search

  cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSeach();
    }
  });

  console.log("Event listener attached!");

  async function handleSeach() {
    const city = cityInput.value.trim();

    if (!city) {
      alert("Please enter a city name!");
      return;
    }

    console.log("Searching for:", city);
    await fetchWeatherData(city);
  }

  async function handleLocationSearch() {
    console.log("Location search clicked!");
    alert("Location feature coming soon");
  }

  async function fetchWeatherData(city) {
    try {
      showLoading();
      console.log("Fetching weather for: ", city);

      const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
      console.log("API URL: ", url);

      const response = await fetch(url);
      const data = await response.json();

      console.log("API Response: ", data);

      if (response.ok) {
        displayWeatherData(data);
        await fetchForecastData(city);
        forecastSection.classList.remove("hidden");
      } else {
        showError(data.message || "City not found");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      showError("Unable to fetch weather data");
    }
  }

  //UI state function
  function showLoading() {
    hideAllSections();
    loadingSection.classList.remove("hidden");
    console.log("Showing Loading...");
  }

  function showError(message) {
    hideAllSections();
    errorSection.classList.remove("hidden");
    document.getElementById("error-message").textContent = message;
    console.log("Showing error: ", message);
  }

  function hideAllSections() {
    loadingSection.classList.add("hidden");
    errorSection.classList.add("hidden");
    currentWeatherSection.classList.add("hidden");
    forecastSection.classList.add("hidden");
  }

  // function displayWeatherData(data) {
  //   hideAllSections();
  //   currentWeatherSection.classList.remove("hidden");
  //   console.log("Displaying weather data: ", data);
  // }

  function displayWeatherData(data) {
    hideAllSections();
    currentWeatherSection.classList.remove("hidden");

    console.log("Displaying weather data:", data);

    //Extract data from API response
    const {
      name: cityName,
      sys: { country },
      weather: [{ description, main: weatherMain }],
      main: { temp, feels_like, humidity, pressure },
      wind: { speed },
    } = data;

    //update city name
    document.getElementById(
      "city-name"
    ).textContent = `${cityName}, ${country}`;

    //update weather description
    document.getElementById("weather-description").textContent = description;

    //update temperature
    document.getElementById("temperature").textContent = Math.round(temp);

    //update weather icon
    document.getElementById("weather-emoji").textContent =
      getWeatherEmoji(weatherMain);

    //update detail cards
    document.getElementById("feels-like").textContent = `${Math.round(
      feels_like
    )}°C`;
    document.getElementById("humidity").textContent = `${humidity}%`;
    document.getElementById("wind-speed").textContent = `${Math.round(
      speed * 3.6
    )} km/h`; // Convert m/s to km/h
    document.getElementById("pressure").textContent = `${pressure} hPa`;

    console.log("Weather data displayed successfully!");
  }

  function getWeatherEmoji(weatherMain) {
    const weatherIcons = {
      Clear: "☀️",
      Clouds: "⛅",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "🌫️",
      Haze: "🌫️",
      Dust: "🌫️",
      Fog: "🌫️",
      Sand: "🌫️",
      Ash: "🌫️",
      Squall: "💨",
      Tornado: "🌪️",
    };

    return weatherIcons[weatherMain] || "🌤️";
  }

  async function fetchForecastData(city) {
    try {
      console.log("Fetching 5 days forecast data for: ", city);

      const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("Forecast API Response: ", data);

      if (response.ok) {
        displayForecastData(data);
      } else {
        console.error("Error fetching forecast data: ", data.message);
      }
    } catch (error) {
      console.error("Error fetching forecast data: ", error);
    }
  }

  // Display 5-Day Forecast Function
  function displayForecastData(data) {
    console.log("Processing forecast data...");

    // The API returns forecast every 3 hours, we want daily forecasts
    const dailyForecasts = [];
    const processedDates = new Set();

    // Process forecast list to get one per day
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      // Only take first forecast for each day (around noon)
      if (!processedDates.has(date) && dailyForecasts.length < 5) {
        processedDates.add(date);
        dailyForecasts.push({
          date: new Date(item.dt * 1000),
          temp_max: Math.round(item.main.temp_max),
          temp_min: Math.round(item.main.temp_min),
          weather: item.weather[0].main,
          description: item.weather[0].description,
        });
      }
    });

    console.log("Daily forecasts:", dailyForecasts);

    // Update forecast cards
    const forecastCards = document.querySelectorAll(".forecast-card");

    dailyForecasts.forEach((forecast, index) => {
      if (forecastCards[index]) {
        const card = forecastCards[index];

        // Update day name
        const dayName = forecast.date.toLocaleDateString("en", {
          weekday: "short",
        });
        card.querySelector(".forecast-day").textContent = dayName;

        // Update weather icon
        card.querySelector(".forecast-icon").textContent = getWeatherEmoji(
          forecast.weather
        );

        // Update temperatures
        card.querySelector(
          ".forecast-high"
        ).textContent = `${forecast.temp_max}°`;
        card.querySelector(
          ".forecast-low"
        ).textContent = `${forecast.temp_min}°`;
      }
    });

    console.log("Forecast cards updated!");
  }

  async function handleLocationSearch() {
    console.log("Getting user location...");

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location found:", { latitude, longitude });

        try {
          // Get weather by coordinates
          const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          const response = await fetch(url);
          const data = await response.json();

          if (response.ok) {
            displayWeatherData(data);
            // Also get forecast for current location
            const forecastUrl = `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            const forecastResponse = await fetch(forecastUrl);
            const forecastData = await forecastResponse.json();

            if (forecastResponse.ok) {
              displayForecastData(forecastData);
              forecastSection.classList.remove("hidden");
            }
          } else {
            showError("Unable to get weather for your location");
          }
        } catch (error) {
          console.error("Location weather error:", error);
          showError("Unable to get weather for your location");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        hideAllSections();
        showError(
          "Unable to get your location. Please allow location access or search manually."
        );
      }
    );
  }
});

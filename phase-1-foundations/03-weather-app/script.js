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

  function displayWeatherData(data) {
    hideAllSections();
    currentWeatherSection.classList.remove("hidden");
    console.log("Displaying weather data: ", data);
  }

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
  }
});

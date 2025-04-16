// OpenWeatherMap API Key 
const OPENWEATHER_API_KEY = 'ad9400830df362ab16c2771455d6965a'; 

// AccuWeather API Key
const ACCUWEATHER_API_KEY = 'ad9400830df362ab16c2771455d6965a';

// Function to fetch weather based on the user's location (Geolocation)
async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("Error fetching weather data.");
      return;
    }

    const { temp, humidity } = data.main;
    const weatherCondition = data.weather[0].description;

    return { temp, humidity, weatherCondition };
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Function to fetch Wind data and Air Quality (AccuWeather API)
async function fetchWindAndAirQuality(lat, lon) {
  try {
    const response = await fetch(`https://api.accuweather.com/currentconditions/v1/${lat},${lon}?apikey=${ACCUWEATHER_API_KEY}`);
    const data = await response.json();

    const windSpeed = data[0].Wind.Speed.Metric.Value;
    const windDirection = data[0].Wind.Direction.Degrees;
    const airQualityIndex = data[0].AirQuality;

    return { windSpeed, windDirection, airQualityIndex };
  } catch (error) {
    console.error("Error fetching wind and air quality data:", error);
  }
}

// Function to display weather info on the page
function displayWeatherInfo({ temp, humidity, weatherCondition }) {
  const weatherContainer = document.getElementById('weather-info');
  weatherContainer.innerHTML = `
    <h3>Weather at Your Location</h3>
    <p>Temperature: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Condition: ${weatherCondition}</p>
  `;
}

// Function to display wind and air quality data
function displayWindAndAirQuality({ windSpeed, windDirection, airQualityIndex }) {
  const windContainer = document.getElementById('wind-info');
  windContainer.innerHTML = `
    <p>Wind Speed: ${windSpeed} km/h</p>
    <p>Wind Direction: ${windDirection}°</p>
    <p>Air Quality Index: ${airQualityIndex}</p>
  `;
}

// Function to handle the geolocation and fetch data
function getLocationAndFetchData(fetchFunction, displayFunction) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const data = await fetchFunction(latitude, longitude);
      displayFunction(data);
    }, () => {
      alert("Geolocation not supported or permission denied.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Function to handle weather report submission
function submitWeatherReport() {
  const reportDescription = document.getElementById('report-description').value;
  if (reportDescription) {
    const reportList = document.getElementById('report-list');
    const newReport = document.createElement('div');
    newReport.textContent = `Weather Report: ${reportDescription}`;
    reportList.appendChild(newReport);
    document.getElementById('report-description').value = '';
  } else {
    alert("Please provide a description of the weather.");
  }
}

// Function to fetch weather based on city input
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const data = await response.json();

    if (data.cod !== 200) {
      alert("City not found.");
      return;
    }

    const { temp, humidity } = data.main;
    const weatherCondition = data.weather[0].description;

    return { temp, humidity, weatherCondition };
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// Function to show error message if no weather data is found
function showError(message) {
  const weatherContainer = document.getElementById('weather-info');
  weatherContainer.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Function to show weather information for a city
function handleCityWeatherSearch() {
  const cityInput = document.getElementById('city-input').value.trim();

  if (cityInput) {
    fetchWeatherByCity(cityInput).then(data => {
      if (data) {
        displayWeatherInfo(data);
      } else {
        showError("Weather data not available for the given city.");
      }
    });
  } else {
    alert("Please enter a city name.");
  }
}

// Function to update the map with new city
function updateMap() {
  const city = document.getElementById('city-input').value;
  if (!city) return;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        const iframe = document.getElementById('weather-iframe');
        iframe.src = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=8&type=wind&menu=true&message=true&marker=true&calendar=now&pressure=true&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`;
      } else {
        alert("City not found. Please try again.");
      }
    })
    .catch(error => alert("Error fetching weather data. Please try again later."));
}

// Event Listeners
document.getElementById('submit-report').addEventListener('click', submitWeatherReport);
document.getElementById('search-city').addEventListener('click', handleCityWeatherSearch);
document.getElementById('get-current-weather').addEventListener('click', () => {
  getLocationAndFetchData(fetchWeather, displayWeatherInfo);
});
document.getElementById('get-wind-air-quality').addEventListener('click', () => {
  getLocationAndFetchData(fetchWindAndAirQuality, displayWindAndAirQuality);
});
document.getElementById('search-map').addEventListener('click', updateMap);

const API_KEY = "ad9400830df362ab16c2771455d6965a"; // <-- Your OpenWeatherMap API Key

// Add the cities you want to display
const cities = [
  { name: "Nagpur", lat: 21.1458, lon: 79.0882 },
  { name: "Amravati", lat: 20.9374, lon: 77.7796 },
  { name: "Wardha", lat: 20.7350, lon: 78.6022 },
  { name: "Akola", lat: 20.7059, lon: 77.0033 }
  // Add more cities here if needed
];

function getColor(temp) {
  if (temp > 40) return "#ff0000";
  else if (temp > 30) return "#ff9900";
  else if (temp > 25) return "#ffd700";
  else if (temp > 20) return "#00ff00";
  else if (temp > 10) return "#00ccff";
  else return "#0000ff";
}

function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const temp = data.main.temp;
      const marker = L.circleMarker([city.lat, city.lon], {
        radius: 8,
        fillColor: getColor(temp),
        color: '#333',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(`<b>${city.name}</b><br>Temp: ${temp}°C`);
    })
    .catch(err => console.error("Weather error", err));
}

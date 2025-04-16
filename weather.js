const apiKey = '74dd6e09b9c459d3ee707b62de48de9d'; // Replace with your actual API key

document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.getElementById('fetchWeatherBtn');
  const cityInput = document.getElementById('cityInput');
  const cityWeather = document.getElementById('cityWeather');
  const loadingMessage = document.getElementById('loadingMessage');
  const dynamicTip = document.getElementById('dynamicTip'); // Make sure this ID exists in your HTML

  fetchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      getWeather(city);
    }
  });

  window.autoCity = function(city) {
    cityInput.value = city;
    getWeather(city);
  };

  function getWeather(city) {
    loadingMessage.style.display = 'block';
    cityWeather.innerHTML = '';
    dynamicTip.textContent = ''; // clear previous tip

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    axios.get(url)
      .then(response => {
        loadingMessage.style.display = 'none';
        const data = response.data;

        const temp = data.main.temp;
        const weather = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const wind = data.wind.speed;
        const humidity = data.main.humidity;

        const tip = generateTip(temp, weather, wind, humidity);

        cityWeather.innerHTML = `
          <div class="weather-card">
            <h3>📍 ${data.name}, ${data.sys.country}</h3>
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${weather}</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind} m/s</p>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather}" />
            <hr>
          </div>
        `;

        // ✅ Update real-time tip below "Tips Based on Conditions"
        dynamicTip.textContent = `🧠 Tip: ${tip}`;
      })
      .catch(error => {
        loadingMessage.style.display = 'none';
        cityWeather.innerHTML = `
          <div class="weather-card">
            <p>❌ Could not retrieve weather for "<strong>${city}</strong>". Please check the city name.</p>
          </div>
        `;
        dynamicTip.textContent = `🧠 Tip: Unable to fetch weather data. Try again later.`;
        console.error(error);
      });
  }

  function generateTip(temp, condition, wind, humidity) {
    const c = condition.toLowerCase();

    if (temp > 35) return "Stay hydrated, avoid direct sunlight. 🥵";
    if (c.includes('rain')) return "Carry an umbrella and avoid water-logged areas. ☔";
    if (c.includes('snow')) return "Dress warmly and be cautious while driving. ❄";
    if (wind > 10) return "Secure loose items and avoid outdoor activities. 🌬";
    if (humidity > 80) return "High humidity: Stay cool and drink plenty of fluids. 💧";

    return "Weather looks good! Have a nice day. 😎";
  }
});

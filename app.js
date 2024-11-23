const weather = document.querySelector(".weather");

const weatherForm = document.querySelector(".weather_search");
const input = weatherForm.querySelector("input");
const btnSubmit = weatherForm.querySelector("button");

const weatherCity = document.querySelector(".weather_city");
const weatherTemperature = document.querySelector(".weather_temperature");
const weatherTable = document.querySelector(".weather_table");
const weatherCountry = weatherTable.querySelector(".country");
const weatherTimezone = weatherTable.querySelector(".timezone");
const weatherPopulation = weatherTable.querySelector(".population");
const weatherForecast = weatherTable.querySelector(".forecast");

const GetCity = async (city) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();
    return data.results[0];
  } catch (err) {
    console.error(err);
  }
};

const GetWeather = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const buildInfo = async (cityName) => {
  const cityData = await GetCity(cityName);
  const latitude = cityData.latitude;
  const longitude = cityData.longitude;
  const weatherData = await GetWeather(latitude, longitude);

  weatherCity.textContent = cityData.name;
  weatherCountry.textContent = cityData.country;
  weatherPopulation.textContent = cityData.population.toLocaleString();
  weatherTimezone.textContent = weatherData.timezone;
  weatherTemperature.textContent = `${weatherData.current.temperature_2m}°C`;

  weatherForecast.innerHTML = `
    <span>Low: ${weatherData.daily.temperature_2m_min[0]}°C</span>
    <span>Max: ${weatherData.daily.temperature_2m_max[0]}°C</span>
  `;

  changeDayNight(weatherData.current.is_day);

  document.querySelector(".weather__info").style.display = "block";
};

function changeDayNight(day) {
  if (day) {
    weather.classList.remove("night");
    weather.classList.add("day");
  } else {
    weather.classList.remove("day");
    weather.classList.add("night");
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const city = input.value.trim();
  if (city) {
    buildInfo(city);
  }
}

weatherForm.addEventListener("submit", handleSubmit);

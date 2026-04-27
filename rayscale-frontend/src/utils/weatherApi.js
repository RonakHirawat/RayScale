/**
 * Weather API integration using Open-Meteo (Free, no API key required).
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Fetch current weather by coordinates using Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>} Parsed weather data
 */
export async function fetchWeatherByCoords(lat, lon) {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=sunrise,sunset&timezone=auto&wind_speed_unit=ms`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();
  return parseOpenMeteoData(data, lat, lon);
}

/**
 * Fetch current weather by city name using Open-Meteo Geocoding.
 * @param {string} city
 */
export async function fetchWeatherByCity(city) {
  // 1. Get coordinates for city
  const geoResponse = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!geoResponse.ok) throw new Error('Geocoding API error');
  
  const geoData = await geoResponse.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }
  
  const location = geoData.results[0];
  
  // 2. Fetch weather using coordinates
  const weatherData = await fetchWeatherByCoords(location.latitude, location.longitude);
  
  // 3. Override city/country with geocoded info
  weatherData.city = location.name;
  weatherData.country = location.country_code;
  
  return weatherData;
}

/**
 * Parse Open-Meteo response into app-friendly format.
 */
function parseOpenMeteoData(data, lat, lon) {
  const current = data.current || {};
  const daily = data.daily || {};
  
  // Map Open-Meteo WMO weather codes to descriptions
  // https://open-meteo.com/en/docs
  let description = 'Clear';
  const code = current.weather_code || 0;
  
  if (code >= 1 && code <= 3) description = 'Partly Cloudy';
  else if (code >= 45 && code <= 48) description = 'Foggy';
  else if (code >= 51 && code <= 67) description = 'Rainy';
  else if (code >= 71 && code <= 77) description = 'Snowy';
  else if (code >= 80 && code <= 82) description = 'Rain Showers';
  else if (code >= 95) description = 'Thunderstorm';

  return {
    temperature: current.temperature_2m ?? 0,
    humidity: current.relative_humidity_2m ?? 0,
    windSpeed: current.wind_speed_10m ?? 0,
    precipitation: current.precipitation ?? 0,
    description: description,
    icon: '',
    city: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
    country: '',
    feelsLike: current.temperature_2m ?? 0,
    pressure: current.surface_pressure ?? null,
    visibility: null,
    sunrise: daily.sunrise?.[0] ? new Date(daily.sunrise[0]) : null,
    sunset: daily.sunset?.[0] ? new Date(daily.sunset[0]) : null,
    lat: lat,
    lon: lon,
    isDemo: false, // Fully live data now!
  };
}

/**
 * Get user geolocation as a Promise.
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(new Error(err.message)),
      { timeout: 10000 }
    );
  });
}

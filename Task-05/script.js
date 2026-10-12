/**
 * WeatherSphere — Live Weather Dashboard
 * InternCircle Web Development — Task 5
 * 
 * Powered by Open-Meteo Geocoding & Weather Forecast APIs
 * Features:
 * - Asynchronous fetch with async/await and robust try/catch/finally
 * - WMO weather code mapping to semantic descriptions and SVG icons
 * - Race-condition prevention for concurrent/rapid searches
 * - Safe DOM manipulation (textContent) preventing XSS
 * - Accessible loading, error, and retry states
 */

'use strict';

// ==========================================================================
// Constants & Configuration
// ==========================================================================
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_CITY = 'London';

// Request counter to prevent race conditions from out-of-order responses
let activeRequestId = 0;
let lastSearchedCity = DEFAULT_CITY;

// ==========================================================================
// DOM Element References
// ==========================================================================
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchValidation = document.getElementById('search-validation');
const quickCityButtons = document.querySelectorAll('.chip-btn');
const statusBanner = document.getElementById('status-banner');
const statusBannerText = document.getElementById('status-banner-text');

const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const weatherContent = document.getElementById('weather-content');

// Current weather elements
const currentLocation = document.getElementById('current-location');
const currentCoordinates = document.getElementById('current-coordinates');
const currentDate = document.getElementById('current-date');
const currentTemp = document.getElementById('current-temp');
const currentCondition = document.getElementById('current-condition');
const currentApparent = document.getElementById('current-apparent');
const currentWeatherIcon = document.getElementById('current-weather-icon');

// Metric elements
const metricApparent = document.getElementById('metric-apparent');
const metricHumidity = document.getElementById('metric-humidity');
const metricWind = document.getElementById('metric-wind');
const metricPrecip = document.getElementById('metric-precip');

// Forecast container
const forecastGrid = document.getElementById('forecast-grid');

// ==========================================================================
// Weather Code (WMO) Mapping & SVG Icons
// ==========================================================================

/**
 * Returns weather description and SVG icon markup for a given WMO code.
 * @param {number} code 
 * @returns {{ description: string, iconSvg: string }}
 */
function getWeatherDetails(code) {
  // SVG Icon definitions
  const sunIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;

  const cloudSunIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41M2 12h2"></path>
      <path d="M17.5 19H9a5 5 0 0 1-1-9.9 7 7 0 0 1 12.9 3.9 4 4 0 0 1-3.4 6z"></path>
    </svg>`;

  const cloudIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>`;

  const fogIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="8" x2="20" y2="8"></line>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="16" x2="20" y2="16"></line>
      <line x1="4" y1="20" x2="16" y2="20"></line>
    </svg>`;

  const rainIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 13v6M8 13v6M12 15v6"></path>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
    </svg>`;

  const heavyRainIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="15" x2="8" y2="21"></line>
      <line x1="12" y1="15" x2="12" y2="21"></line>
      <line x1="16" y1="15" x2="16" y2="21"></line>
      <line x1="10" y1="17" x2="10" y2="23"></line>
      <line x1="14" y1="17" x2="14" y2="23"></line>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
    </svg>`;

  const snowIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
      <line x1="8" y1="16" x2="8.01" y2="16"></line>
      <line x1="8" y1="20" x2="8.01" y2="20"></line>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
      <line x1="16" y1="16" x2="16.01" y2="16"></line>
      <line x1="16" y1="20" x2="16.01" y2="20"></line>
    </svg>`;

  const thunderIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
      <polyline points="13 11 9 17 15 17 11 23"></polyline>
    </svg>`;

  // Mapping WMO Codes
  switch (code) {
    case 0:
      return { description: 'Clear sky', iconSvg: sunIcon };
    case 1:
      return { description: 'Mainly clear', iconSvg: sunIcon };
    case 2:
      return { description: 'Partly cloudy', iconSvg: cloudSunIcon };
    case 3:
      return { description: 'Overcast', iconSvg: cloudIcon };
    case 45:
    case 48:
      return { description: 'Foggy', iconSvg: fogIcon };
    case 51:
      return { description: 'Light drizzle', iconSvg: rainIcon };
    case 53:
      return { description: 'Moderate drizzle', iconSvg: rainIcon };
    case 55:
      return { description: 'Dense drizzle', iconSvg: rainIcon };
    case 56:
    case 57:
      return { description: 'Freezing drizzle', iconSvg: rainIcon };
    case 61:
      return { description: 'Slight rain', iconSvg: rainIcon };
    case 63:
      return { description: 'Moderate rain', iconSvg: rainIcon };
    case 65:
      return { description: 'Heavy rain', iconSvg: heavyRainIcon };
    case 66:
    case 67:
      return { description: 'Freezing rain', iconSvg: rainIcon };
    case 71:
      return { description: 'Slight snow', iconSvg: snowIcon };
    case 73:
      return { description: 'Moderate snow', iconSvg: snowIcon };
    case 75:
      return { description: 'Heavy snow', iconSvg: snowIcon };
    case 77:
      return { description: 'Snow grains', iconSvg: snowIcon };
    case 80:
      return { description: 'Slight showers', iconSvg: rainIcon };
    case 81:
      return { description: 'Moderate showers', iconSvg: rainIcon };
    case 82:
      return { description: 'Violent showers', iconSvg: heavyRainIcon };
    case 85:
      return { description: 'Slight snow showers', iconSvg: snowIcon };
    case 86:
      return { description: 'Heavy snow showers', iconSvg: snowIcon };
    case 95:
      return { description: 'Thunderstorm', iconSvg: thunderIcon };
    case 96:
    case 99:
      return { description: 'Thunderstorm with hail', iconSvg: thunderIcon };
    default:
      return { description: 'Atmospheric conditions', iconSvg: cloudSunIcon };
  }
}

// ==========================================================================
// UI State Handlers
// ==========================================================================

/**
 * Sets UI to loading state and prevents duplicate requests.
 */
function showLoading() {
  clearValidationError();
  searchBtn.disabled = true;
  cityInput.disabled = true;

  loadingState.removeAttribute('hidden');
  errorState.setAttribute('hidden', '');
  weatherContent.setAttribute('hidden', '');
}

/**
 * Displays error message with retry option.
 * @param {string} title 
 * @param {string} message 
 */
function showError(title, message) {
  searchBtn.disabled = false;
  cityInput.disabled = false;

  errorTitle.textContent = title;
  errorMessage.textContent = message;

  loadingState.setAttribute('hidden', '');
  errorState.removeAttribute('hidden');
  weatherContent.setAttribute('hidden', '');
}

/**
 * Reveals weather content and restores input controls.
 */
function showWeatherContent() {
  searchBtn.disabled = false;
  cityInput.disabled = false;

  loadingState.setAttribute('hidden', '');
  errorState.setAttribute('hidden', '');
  weatherContent.removeAttribute('hidden');
}

/**
 * Displays validation alert for empty search inputs.
 * @param {string} message 
 */
function showValidationError(message) {
  searchValidation.textContent = message;
  searchValidation.removeAttribute('hidden');
  cityInput.classList.add('input-invalid');
  cityInput.focus();
}

/**
 * Clears input validation alert.
 */
function clearValidationError() {
  searchValidation.textContent = '';
  searchValidation.setAttribute('hidden', '');
  cityInput.classList.remove('input-invalid');
}

// ==========================================================================
// Data Fetching & Geocoding
// ==========================================================================

/**
 * Geocodes city name and fetches weather data.
 * @param {string} rawCity 
 */
async function searchCity(rawCity) {
  const city = rawCity.trim();

  if (!city) {
    showValidationError('Please enter a city name to search.');
    return;
  }

  // Increment request ID to ignore stale responses
  const currentRequestId = ++activeRequestId;
  lastSearchedCity = city;

  showLoading();

  try {
    // 1. Call Open-Meteo Geocoding API
    const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Geocoding service error (${geoResponse.status}). Please try again later.`);
    }

    const geoData = await geoResponse.json();

    // Check if request is still active
    if (currentRequestId !== activeRequestId) return;

    if (!geoData.results || geoData.results.length === 0) {
      showError('City Not Found', `No matching location found for "${city}". Please check the spelling.`);
      return;
    }

    const location = geoData.results[0];
    const { name, latitude, longitude, country, admin1 } = location;

    // Assemble formatted location label
    const locationParts = [name];
    if (admin1 && admin1 !== name) locationParts.push(admin1);
    if (country) locationParts.push(country);
    const fullLocationName = locationParts.join(', ');

    // 2. Fetch Weather Forecast from Open-Meteo
    await fetchWeatherData(latitude, longitude, fullLocationName, currentRequestId);

  } catch (err) {
    if (currentRequestId !== activeRequestId) return;
    console.error('Weather search error:', err);
    showError(
      'Network or Connection Error',
      err.message || 'Unable to connect to Open-Meteo weather service. Please check your internet connection.'
    );
  }
}

/**
 * Fetches current and daily forecast data for specific coordinates.
 * @param {number} lat 
 * @param {number} lon 
 * @param {string} locationName 
 * @param {number} requestId 
 */
async function fetchWeatherData(lat, lon, locationName, requestId) {
  try {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto'
    });

    const forecastUrl = `${FORECAST_API_URL}?${params.toString()}`;
    const forecastResponse = await fetch(forecastUrl);

    if (!forecastResponse.ok) {
      throw new Error(`Forecast service error (${forecastResponse.status}).`);
    }

    const forecastData = await forecastResponse.json();

    // Ensure request is still current
    if (requestId !== activeRequestId) return;

    // Render current conditions & 5-day forecast
    renderCurrentWeather(forecastData, locationName, lat, lon);
    renderForecast(forecastData.daily);

    // Update status banner
    if (locationName.toLowerCase().startsWith('london')) {
      statusBannerText.textContent = `Showing default city: ${locationName}. Enter any city above for live conditions.`;
    } else {
      statusBannerText.textContent = `Showing live weather for ${locationName}.`;
    }

    showWeatherContent();

  } catch (err) {
    if (requestId !== activeRequestId) return;
    console.error('Forecast fetch error:', err);
    showError('Weather Data Unavailable', err.message || 'Unable to parse forecast response.');
  }
}

// ==========================================================================
// UI Rendering
// ==========================================================================

/**
 * Renders the current weather hero section and metrics grid.
 * @param {Object} data 
 * @param {string} locationName 
 * @param {number} lat 
 * @param {number} lon 
 */
function renderCurrentWeather(data, locationName, lat, lon) {
  const current = data.current;
  if (!current) return;

  const weather = getWeatherDetails(current.weather_code);

  // Set location and coordinates
  currentLocation.textContent = locationName;
  currentCoordinates.textContent = `Coordinates: ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;

  // Format local date / time
  try {
    const dateObj = new Date(current.time);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    currentDate.textContent = formattedDate;
  } catch {
    currentDate.textContent = current.time || 'Live';
  }

  // Hero temperatures and condition
  currentTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
  currentCondition.textContent = weather.description;
  currentApparent.textContent = `Feels like ${Math.round(current.apparent_temperature)}°C`;

  // Weather Icon
  currentWeatherIcon.innerHTML = weather.iconSvg;

  // Meteorological metrics
  metricApparent.textContent = `${Math.round(current.apparent_temperature)}°C`;
  metricHumidity.textContent = `${current.relative_humidity_2m}%`;
  metricWind.textContent = `${current.wind_speed_10m} km/h`;
  metricPrecip.textContent = `${current.precipitation} mm`;
}

/**
 * Renders the 5-day daily forecast cards.
 * @param {Object} daily 
 */
function renderForecast(daily) {
  if (!daily || !daily.time || !Array.isArray(daily.time)) return;

  // Clear existing forecast cards
  while (forecastGrid.firstChild) {
    forecastGrid.removeChild(forecastGrid.firstChild);
  }

  // Render up to 5 days (starting from day 1 or index 0 up to 5 days)
  const daysToRender = Math.min(5, daily.time.length);

  for (let i = 0; i < daysToRender; i++) {
    const dateStr = daily.time[i];
    const code = daily.weather_code ? daily.weather_code[i] : 0;
    const maxTemp = daily.temperature_2m_max ? Math.round(daily.temperature_2m_max[i]) : '--';
    const minTemp = daily.temperature_2m_min ? Math.round(daily.temperature_2m_min[i]) : '--';
    const precipProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : null;

    const weather = getWeatherDetails(code);

    // Format weekday and date
    let dayName = 'Day';
    let monthDay = dateStr;
    try {
      const dateObj = new Date(dateStr + 'T00:00:00');
      dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      dayName = dateStr;
    }

    // Create forecast card element
    const card = document.createElement('article');
    card.className = 'forecast-card';
    card.setAttribute('aria-label', `${dayName} weather: ${weather.description}`);

    // Day & Date
    const dayEl = document.createElement('span');
    dayEl.className = 'forecast-day';
    dayEl.textContent = dayName;

    const dateEl = document.createElement('span');
    dateEl.className = 'forecast-date';
    dateEl.textContent = monthDay;

    // Weather Icon
    const iconEl = document.createElement('div');
    iconEl.className = 'forecast-icon';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.innerHTML = weather.iconSvg;

    // Condition description
    const descEl = document.createElement('span');
    descEl.className = 'forecast-desc';
    descEl.textContent = weather.description;

    // Temperatures
    const tempsEl = document.createElement('div');
    tempsEl.className = 'forecast-temps';

    const maxSpan = document.createElement('span');
    maxSpan.className = 'temp-max';
    maxSpan.textContent = `${maxTemp}°`;
    maxSpan.title = 'High';

    const sepSpan = document.createElement('span');
    sepSpan.textContent = '/';
    sepSpan.style.color = 'var(--color-text-subtle)';

    const minSpan = document.createElement('span');
    minSpan.className = 'temp-min';
    minSpan.textContent = `${minTemp}°`;
    minSpan.title = 'Low';

    tempsEl.appendChild(maxSpan);
    tempsEl.appendChild(sepSpan);
    tempsEl.appendChild(minSpan);

    // Append standard elements
    card.appendChild(dayEl);
    card.appendChild(dateEl);
    card.appendChild(iconEl);
    card.appendChild(descEl);
    card.appendChild(tempsEl);

    // Optional precipitation probability badge
    if (precipProb !== null && typeof precipProb !== 'undefined') {
      const precipEl = document.createElement('span');
      precipEl.className = 'forecast-precip';
      precipEl.textContent = `${precipProb}% rain`;
      card.appendChild(precipEl);
    }

    forecastGrid.appendChild(card);
  }
}

// ==========================================================================
// Event Listeners & Initialization
// ==========================================================================

function initEventListeners() {
  // Search form submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchCity(cityInput.value);
  });

  // Clear validation when user starts typing
  cityInput.addEventListener('input', () => {
    if (cityInput.classList.contains('input-invalid')) {
      clearValidationError();
    }
  });

  // Quick city suggestion buttons
  quickCityButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city');
      if (city) {
        cityInput.value = city;
        searchCity(city);
      }
    });
  });

  // Retry button
  retryBtn.addEventListener('click', () => {
    searchCity(lastSearchedCity || DEFAULT_CITY);
  });
}

function init() {
  initEventListeners();
  // Load default city on startup
  searchCity(DEFAULT_CITY);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


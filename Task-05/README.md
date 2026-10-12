# Live Weather Dashboard with Fetch API

## Overview

WeatherSphere is a modern, responsive, and accessible weather dashboard application developed with vanilla HTML5, CSS3, and JavaScript (ES6+). It interfaces with Open-Meteo's open meteorological and geocoding APIs to deliver real-time atmospheric observations, detailed meteorological metrics, and 5-day daily forecasts for cities worldwide without requiring an API key.

> **Note:** An active internet connection is required to communicate with Open-Meteo's public API endpoints.

## Features

- **Live City Search**: Search any global city by name with geocoding resolution.
- **Default City Fallback**: Loads London as a sensible initial default with clear visual disclosure and effortless one-click city suggestions (Tokyo, New York, Sydney, Paris).
- **Current Weather Observations**:
  - Live temperature (°C)
  - Semantic weather condition description
  - Contextual SVG weather icon mapped from standard WMO codes
  - Feels-like (apparent) temperature
- **Meteorological Metrics**:
  - Apparent Temperature (°C)
  - Relative Humidity (%)
  - Wind Speed (km/h)
  - Precipitation (mm)
- **5-Day Daily Forecast**:
  - Day of week and calendar date
  - Condition icon and descriptive status
  - Daily High (Max) and Low (Min) temperature projections
  - Precipitation probability percentage
- **Robust Asynchronous Error & State Handling**:
  - Accessible loading spinner while requests are in flight
  - Inline input validation for empty or whitespace searches
  - Detailed error states for city not found, network failure, or API downtime
  - "Try Again" retry action restoring previous search context
  - Race condition prevention ensuring older pending requests never overwrite newer searches
- **Responsive & Accessible Design**:
  - Mobile-first, fluid layout tested from 320px to 1440px+
  - Semantic HTML5 structure, ARIA live regions (`aria-live`), high-contrast focus rings, and `prefers-reduced-motion` compliance
  - XSS-safe DOM node creation with `textContent`

## Technologies

- **HTML5**: Semantic document layout (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`).
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, media queries, keyframe animations, and reduced motion queries.
- **Vanilla JavaScript (ES6+)**: `async/await`, Fetch API, DOM manipulation, URLSearchParams, and event handling.
- **Open-Meteo APIs**: Free public geocoding and forecast data services.

## API Endpoints Used

1. **Geocoding API**:
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json
   ```
   Resolves the search query string into geographical latitude, longitude, country, and administrative region.

2. **Weather Forecast API**:
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto
   ```
   Returns current meteorological readings and daily forecasts in metric units (°C, km/h, mm) with localized timezone resolution.

## How Geocoding Works

When a user submits a city query:
1. The application sanitizes the input string and constructs a request to Open-Meteo's Geocoding API with `encodeURIComponent()`.
2. The response is parsed to inspect the `results` array.
3. If no matching cities are found or the array is empty, the dashboard displays an accessible "City Not Found" error card.
4. If a match is found, the coordinates (`latitude`, `longitude`) along with administrative region and country names are extracted to label the location accurately.

## How Weather Data is Fetched

Using the resolved coordinates:
1. An asynchronous request is dispatched to Open-Meteo's `/forecast` endpoint requesting current metrics and daily 7-day outlook arrays.
2. The response payload is processed in JavaScript.
3. `renderCurrentWeather()` populates the current weather card and metrics grid.
4. `renderForecast()` slices and transforms the first 5 days of forecast data, formatting dates and associating WMO weather codes with descriptive strings and custom SVG icons.

## How Asynchronous Requests and Errors are Handled

- **Race Condition Prevention**: An incremental `activeRequestId` counter tracks each search operation. If a user enters multiple searches in rapid succession, responses matching outdated request IDs are safely ignored.
- **Try / Catch / Finally**: API calls are wrapped in robust `try...catch` blocks to capture HTTP status errors (e.g., 404, 500) and network disconnects (`TypeError: Failed to fetch`).
- **State Control**: Dedicated functions (`showLoading()`, `showError()`, `showWeatherContent()`) cleanly toggle visibility of interface sections and disable form controls during processing.

## How to Run

### Direct File Execution
Open `index.html` directly in any web browser with internet access:
- Double-click `Task-05/index.html`, or
- Right-click `index.html` and select **Open with** &rarr; **Google Chrome** / **Mozilla Firefox** / **Microsoft Edge**.

### Local Development Server (Optional)
Serve using Python:
```bash
# Inside Task-05:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

## Task Requirements Covered

| Requirement | Implementation |
| :--- | :--- |
| **Vanilla HTML/CSS/JS** | Zero external frameworks, libraries, or build dependencies. |
| **Fetch API & async/await** | Clean asynchronous pipeline querying Open-Meteo services. |
| **Geocoding & Forecast** | Converts city names to coordinates, then queries weather and 5-day daily forecasts. |
| **WMO Weather Code Mapping** | Custom mapping function translating numeric codes into semantic descriptions and SVG icons. |
| **Metrics Display** | Current temperature, apparent temperature, humidity, wind speed, and precipitation. |
| **Error & Retry Handling** | Input validation, city-not-found handling, network failure alerts, and a functioning retry button. |
| **Responsive Design** | Tested and verified across 320px, 375px, 425px, 768px, 1024px, 1280px, and 1440px. |
| **Accessibility** | Semantic HTML5, visible focus indicators, `aria-live` status regions, and reduced-motion queries. |


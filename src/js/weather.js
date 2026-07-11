/**
 * Weather API Client - Handles geocoding and weather data retrieval from Open-Meteo
 */

const CACHE_EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

// WMO Weather Interpretation Codes (https://open-meteo.com/en/docs)
const WEATHER_CODES = {
  0: { label: { en: 'Clear sky', hi: 'साफ़ आसमान' }, alert: 'safe', icon: '☀️' },
  1: { label: { en: 'Mainly clear', hi: 'मुख्यतः साफ़' }, alert: 'safe', icon: '🌤️' },
  2: { label: { en: 'Partly cloudy', hi: 'आंशिक रूप से बादल' }, alert: 'safe', icon: '⛅' },
  3: { label: { en: 'Overcast', hi: 'बादल छाए हुए' }, alert: 'safe', icon: '☁️' },
  45: { label: { en: 'Fog', hi: 'कोहरा' }, alert: 'caution', icon: '🌫️' },
  48: { label: { en: 'Depositing rime fog', hi: 'पाला कोहरा' }, alert: 'caution', icon: '🌫️' },
  51: { label: { en: 'Light drizzle', hi: 'हल्की बूंदाबांदी' }, alert: 'caution', icon: '🌧️' },
  53: { label: { en: 'Moderate drizzle', hi: 'मध्यम बूंदाबांदी' }, alert: 'caution', icon: '🌧️' },
  55: { label: { en: 'Dense drizzle', hi: 'सघन बूंदाबांदी' }, alert: 'caution', icon: '🌧️' },
  61: { label: { en: 'Slight rain', hi: 'हल्की बारिश' }, alert: 'caution', icon: '🌧️' },
  63: { label: { en: 'Moderate rain', hi: 'मध्यम बारिश' }, alert: 'caution', icon: '🌧️' },
  65: { label: { en: 'Heavy rain', hi: 'भारी बारिश' }, alert: 'alert', icon: '🚨' },
  80: { label: { en: 'Slight rain showers', hi: 'हल्की बौछारें' }, alert: 'caution', icon: '🌧️' },
  81: { label: { en: 'Moderate rain showers', hi: 'मध्यम बौछारें' }, alert: 'caution', icon: '🌧️' },
  82: { label: { en: 'Violent rain showers', hi: 'अत्यधिक बारिश बौछारें' }, alert: 'alert', icon: '🚨' },
  95: { label: { en: 'Thunderstorm', hi: 'गरज के साथ तूफान' }, alert: 'alert', icon: '⛈️' },
  96: { label: { en: 'Thunderstorm with slight hail', hi: 'ओलों के साथ आंधी' }, alert: 'alert', icon: '⛈️' },
  99: { label: { en: 'Thunderstorm with heavy hail', hi: 'भारी ओलों के साथ आंधी' }, alert: 'alert', icon: '🚨' }
};

export const Weather = {
  /**
   * Translates WMO weather code to descriptive label, icon, and alert level
   * @param {number} code 
   * @param {string} lang 
   */
  getWeatherMeta(code, lang = 'en') {
    const meta = WEATHER_CODES[code] || { label: { en: 'Unknown conditions', hi: 'अज्ञात मौसम' }, alert: 'caution', icon: '❓' };
    return {
      text: meta.label[lang] || meta.label.en,
      alert: meta.alert,
      icon: meta.icon
    };
  },

  /**
   * Resolves a city name to latitude and longitude
   * @param {string} cityName 
   * @returns {Promise<Object>} { lat, lon, name }
   */
  async fetchCoordinates(cityName) {
    const cleanCity = encodeURIComponent(cityName.trim());
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cleanCity}&count=1&language=en&format=json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`City "${cityName}" could not be found.`);
    }
    
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      name: `${result.name}, ${result.country || ''}`
    };
  },

  /**
   * Fetches weather information using coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Object>}
   */
  async fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather fetch failed with status ${response.status}`);
    }
    
    return await response.ok ? response.json() : null;
  },

  /**
   * Fetches weather for a city with 15-minute caching mechanism
   * @param {string} cityName 
   * @returns {Promise<Object>}
   */
  async getWeatherForCity(cityName) {
    if (!cityName) throw new Error('City name is required.');
    
    const cacheKey = `rainguard_weather_cache_${cityName.toLowerCase().trim()}`;
    
    try {
      // Check cache first
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;
        if (age < CACHE_EXPIRATION_MS) {
          console.log(`Serving weather from cache for: ${cityName}`);
          return cacheData.data;
        }
      }
    } catch (e) {
      console.warn('Weather cache read failed, falling back to network fetch.', e);
    }
    
    // Cache miss, fetch coords then weather
    const coords = await this.fetchCoordinates(cityName);
    const weatherRaw = await this.fetchWeather(coords.lat, coords.lon);
    
    const weatherData = {
      cityName: coords.name,
      lat: coords.lat,
      lon: coords.lon,
      temp: weatherRaw.current.temperature_2m,
      feelsLike: weatherRaw.current.apparent_temperature,
      humidity: weatherRaw.current.relative_humidity_2m,
      windSpeed: weatherRaw.current.wind_speed_10m,
      precipitation: weatherRaw.current.precipitation,
      weatherCode: weatherRaw.current.weather_code,
      daily: weatherRaw.daily.time.map((time, idx) => ({
        date: time,
        code: weatherRaw.daily.weather_code[idx],
        tempMax: weatherRaw.daily.temperature_2m_max[idx],
        tempMin: weatherRaw.daily.temperature_2m_min[idx],
        precipSum: weatherRaw.daily.precipitation_sum[idx],
        precipProb: weatherRaw.daily.precipitation_probability_max[idx]
      }))
    };
    
    try {
      // Store in cache
      const cacheObj = {
        timestamp: Date.now(),
        data: weatherData
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn('Weather cache write failed', e);
    }
    
    return weatherData;
  },

  /**
   * Fetches weather using direct coordinates
   */
  async getWeatherForCoordinates(lat, lon, customName = null) {
    let name = customName;
    if (!name) {
      try {
        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          name = geoData.locality || geoData.city || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
          if (geoData.principalSubdivision) {
            name += `, ${geoData.principalSubdivision}`;
          }
        } else {
          name = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        }
      } catch (e) {
        console.warn('Reverse geocoding failed', e);
        name = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      }
    }
    
    const weatherRaw = await this.fetchWeather(lat, lon);
    
    return {
      cityName: name,
      lat: lat,
      lon: lon,
      temp: weatherRaw.current.temperature_2m,
      feelsLike: weatherRaw.current.apparent_temperature,
      humidity: weatherRaw.current.relative_humidity_2m,
      windSpeed: weatherRaw.current.wind_speed_10m,
      precipitation: weatherRaw.current.precipitation,
      weatherCode: weatherRaw.current.weather_code,
      daily: weatherRaw.daily.time.map((time, idx) => ({
        date: time,
        code: weatherRaw.daily.weather_code[idx],
        tempMax: weatherRaw.daily.temperature_2m_max[idx],
        tempMin: weatherRaw.daily.temperature_2m_min[idx],
        precipSum: weatherRaw.daily.precipitation_sum[idx],
        precipProb: weatherRaw.daily.precipitation_probability_max[idx]
      }))
    };
  },

  /**
   * Fetches weather for nearby areas
   */
  async getNearbyWeather(lat, lon, mainCityName = '') {
    const namePrefix = mainCityName.split(',')[0];
    
    const n1Name = `${namePrefix} NE Sector`;
    const n2Name = `${namePrefix} SW Sector`;
    
    try {
      const [nearby1, nearby2] = await Promise.all([
        this.getWeatherForCoordinates(lat + 0.05, lon + 0.05, n1Name),
        this.getWeatherForCoordinates(lat - 0.05, lon - 0.05, n2Name)
      ]);
      return [nearby1, nearby2];
    } catch (e) {
      console.warn('Failed to fetch nearby weather', e);
      return [];
    }
  }
};

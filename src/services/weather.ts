import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (city: string) => {
  // 1. Get current weather
  const current = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, units: 'metric', appid: API_KEY, lang: 'vi' }
  });

  // 2. Get forecast (including both hourly and daily)
  const forecast = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: city, units: 'metric', appid: API_KEY, lang: 'en' }
  });

  return {
    current: current.data,
    // Get the next 8 time points (each 3h apart = next 24h)
    hourly: forecast.data.list.slice(0, 8),
    // Filter for 12:00 noon each day for the 5-day forecast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    days: forecast.data.list.filter((item: any) => item.dt_txt.includes("12:00:00"))
  };
};
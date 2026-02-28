"use client"; 
// Mark this component as a Client Component (used in Next.js App Router)

import { useState, useEffect, useMemo } from 'react';
// Import React hooks: 
// useState -> manage state
// useEffect -> handle side effects (like fetching data on mount)
// useMemo -> memoize calculated values (avoid unnecessary recalculation)

import { getWeatherData } from '@/services/weather';
// Import function to fetch weather data from API

import { Forecast } from '@/components/Forecast';
// Import Forecast component (daily forecast)

import { Hourly } from '@/components/Hourly';
// Import Hourly component (hourly forecast)

import { Search, Wind, Droplets, Thermometer, History } from 'lucide-react';
// Import icons from lucide-react

export default function WeatherPage() {
  // Main WeatherPage component

  const [city, setCity] = useState('');
  // State to store city name input from user

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  // State to store weather data returned from API

  const [loading, setLoading] = useState(false);
  // State to control loading indicator

  const [history, setHistory] = useState<string[]>([]);
  // State to store search history (max 3 recent cities)

  const [isExiting, setIsExiting] = useState(false);
  // State to control transition animation when changing city

  const getBgColor = (weather: string) => {
    // Function to return background gradient based on weather condition

    if (weather === 'Clear') 
      return 'from-orange-400 via-rose-400 to-amber-300';

    if (weather === 'Rain' || weather === 'Drizzle') 
      return 'from-blue-900 via-slate-900 to-black';

    if (weather === 'Snow') 
      return 'from-[#2c3e50] via-[#34495e] to-[#bdc3c7]';

    if (weather === 'Clouds') 
      return 'from-indigo-500 via-purple-500 to-slate-600';

    return 'from-[#86b9a1] via-[#a7d7c5] to-[#fbc2eb]';
    // Default gradient
  };

  const weatherEffects = useMemo(() => {
    // Memoized function to generate rain or snow animation elements
    // Re-runs only when 'data' changes

    if (!data) return null;
    // If no data, return nothing

    const status = data.current.weather[0].main;
    // Get main weather status (Rain, Snow, etc.)

    const elements = [];

    if (status === 'Rain' || status === 'Snow') {
      // If Rain or Snow -> generate 50 animated elements

      for (let i = 0; i < 50; i++) {

        const left = Math.random() * 100 + '%';
        // Random horizontal position

        const duration = (Math.random() * 1 + 1.5) + 's';
        // Random animation duration (1.5s - 2.5s)

        const delay = Math.random() * 2 + 's';
        // Random animation delay

        const size = status === 'Snow' 
          ? (Math.random() * 5 + 2) + 'px' 
          : '2px';
        // Snowflakes have random size, rain has fixed width

        elements.push(
          <div 
            key={i}
            className={status === 'Rain' ? 'rain-drop' : 'snow-flake'}
            // Choose class depending on weather type

            style={{
              left,
              animationDuration: duration,
              animationDelay: delay,
              width: size,
              height: status === 'Snow' ? size : '15px'
            }}
          />
        );
      }
    }

    return elements;
  }, [data]);
  // Dependency: re-run when data changes

  useEffect(() => {
    // Runs once when component mounts

    const saved = localStorage.getItem('weather_history');
    // Get saved search history from localStorage

    if (saved) setHistory(JSON.parse(saved));
    // If found, parse and set history

    handleSearch("Ho Chi Minh"); 
    // Automatically load Ho Chi Minh weather on first load
  }, []);

  const handleSearch = async (cityName: string) => {
    // Function to handle city search

    if (!cityName) return;
    // Prevent empty search

    setIsExiting(true);
    // Trigger exit animation

    setTimeout(async () => {
      // Wait 300ms to allow animation to finish

      setLoading(true);
      // Show loading indicator

      try {
        const res = await getWeatherData(cityName);
        // Fetch weather data

        setData(res);
        // Save data to state

        const newHistory = 
          [cityName, ...history.filter(h => h !== cityName)]
          .slice(0, 3);
        // Create new history list:
        // - Add new city to top
        // - Remove duplicate
        // - Keep max 3 items

        setHistory(newHistory);
        // Update state

        localStorage.setItem(
          'weather_history', 
          JSON.stringify(newHistory)
        );
        // Save to localStorage

        setCity('');
        // Clear input field

      } catch (error) {
        alert("City not found!");
        // Show error if API fails

      } finally {
        setLoading(false);
        // Stop loading indicator

        setIsExiting(false);
        // Disable exit animation (show new data)
      }
    }, 300); 
  };

  return (
    <div 
      className={`relative min-h-screen w-full bg-gradient-to-br 
      ${data 
        ? getBgColor(data.current.weather[0].main) 
        : 'from-[#86b9a1] via-[#a7d7c5] to-[#fbc2eb]'} 
      flex items-center justify-center p-4 md:p-10 
      transition-all duration-1000 text-white overflow-hidden`}
    >
      {/* Main background container with dynamic gradient */}

      <div className="absolute inset-0 pointer-events-none">
        {weatherEffects}
      </div>
      {/* Rain/Snow animation layer */}

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row gap-8 items-stretch">
        {/* Layout wrapper */}

        {/* MAIN COLUMN */}
        <div className={`flex-[2] bg-black/20 backdrop-blur-3xl 
          rounded-[3.5rem] p-8 md:p-12 shadow-2xl border 
          border-white/10 flex flex-col transition-all duration-500 
          ${isExiting 
            ? 'opacity-0 scale-95 blur-sm' 
            : 'opacity-100 scale-100 blur-0'}`}>
          {/* Main weather card with transition animation */}

          {/* Search input */}
          <div className="relative mb-8 w-full group">
            <input 
              type="text"
              placeholder="Enter city name..."
              className="w-full bg-black/30 border-2 border-white/20 
              rounded-2xl py-4 px-12 outline-none text-white 
              placeholder-white/60 shadow-inner 
              focus:border-white/50 transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => 
                e.key === 'Enter' && handleSearch(city)}
            />
            <Search 
              className="absolute left-4 top-4 text-white/70" 
              size={20} 
            />
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center 
            font-bold animate-pulse text-white uppercase 
            tracking-[0.3em]">
              Loading...
            </div>
          ) : data && (
            <div className="flex-1 flex flex-col items-center">
              
              <h1 className="text-4xl md:text-7xl font-black drop-shadow-2xl tracking-tighter text-center">
                {data.current.name}
              </h1>
              {/* City name */}

              <p className="text-xl font-medium capitalize mt-1 opacity-90">
                {data.current.weather[0].description}
              </p>
              {/* Weather description */}

              <div className="flex items-center justify-center my-6">
                <img 
                  src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`}
                  className="w-32 h-32 md:w-48 md:h-48 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] brightness-110"
                  alt="Weather Icon"
                />
                <span className="text-9xl font-black tracking-tighter drop-shadow-md">
                  {Math.round(data.current.main.temp)}°
                </span>
              </div>
              {/* Weather icon + temperature */}

              <Hourly items={data.hourly} />
              {/* Hourly forecast component */}

              <div className="w-full grid grid-cols-3 gap-4 
              bg-white/10 rounded-[2.5rem] p-6 
              border border-white/10 shadow-lg mt-8">
                {/* Extra weather details */}

                <div className="flex flex-col items-center group">
                  <Thermometer size={22} 
                    className="text-rose-400 mb-2 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-bold opacity-70 uppercase">
                    Feels Like
                  </span>
                  <span className="font-bold text-xl">
                    {Math.round(data.current.main.feels_like)}°C
                  </span>
                </div>

                <div className="flex flex-col items-center border-x border-white/10 group">
                  <Droplets size={22} 
                    className="text-cyan-300 mb-2 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-bold opacity-70 uppercase">
                    Humidity
                  </span>
                  <span className="font-bold text-xl">
                    {data.current.main.humidity}%
                  </span>
                </div>

                <div className="flex flex-col items-center group">
                  <Wind size={22} 
                    className="text-emerald-300 mb-2 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-bold opacity-70 uppercase">
                    Wind
                  </span>
                  <span className="font-bold text-xl">
                    {data.current.wind.speed} m/s
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIDE COLUMN */}
        <div className={`flex-1 flex flex-col gap-6 
          transition-all duration-500 delay-75 
          ${isExiting 
            ? 'opacity-0 translate-x-10' 
            : 'opacity-100 translate-x-0'}`}>
          
          {/* History card */}
          <div className="bg-black/30 backdrop-blur-2xl 
          rounded-[2.5rem] p-8 border border-white/10 
          shadow-2xl flex-1">
            
            <div className="flex items-center gap-2 mb-6 
            text-white/70 font-bold text-xs uppercase tracking-widest">
              <History size={16} /> Search History
            </div>

            <div className="flex flex-col gap-3">
              {history.map((h, i) => (
                <button 
                  key={i}
                  onClick={() => handleSearch(h)}
                  className="w-full bg-white/10 hover:bg-white/20 
                  transition-all text-left py-4 px-6 rounded-2xl 
                  font-bold text-white border border-white/5">
                  {h}
                </button>
              ))}
            </div>
          </div>

          {data && <Forecast items={data.days} />}
          {/* Daily forecast component */}
        </div>
      </div>
    </div>
  );
}
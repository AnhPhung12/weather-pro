"use client";
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hourly = ({ items }: { items: any[] }) => {
  return (
    <div className="w-full mt-6 bg-white/10 backdrop-blur-sm rounded-[2rem] p-5 border border-white/20 shadow-inner overflow-x-auto no-scrollbar">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700/60 mb-4 text-center">
        Forecast for the next 24 hours
      </h3>
      <div className="flex justify-between items-center gap-6 min-w-max px-2">
        {items.map((item, index) => {
          // Format time as hh:mm
          const time = new Date(item.dt * 1000).toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          return (
            <div key={index} className="flex flex-col items-center group transition-all">
              <span className="text-[11px] font-bold text-white/90">{time}</span>
              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                alt="weather" 
                className="w-12 h-12 drop-shadow-md group-hover:scale-110 transition-transform"
              />
              <span className="font-black text-white text-sm">{Math.round(item.main.temp)}°</span>
              
              {/* Display Probability of Precipitation */}
              <div className="h-4">
                {item.pop > 0 && (
                  <span className="text-[9px] text-cyan-300 font-bold flex items-center gap-0.5">
                    {Math.round(item.pop * 100)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
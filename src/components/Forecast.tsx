"use client";
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Forecast = ({ items }: { items: any[] }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-6 text-center">
        Forecast for the next 5 days
      </h3>
      <div className="flex flex-col gap-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between group">
            <span className="text-sm font-bold text-white/90 w-12">
              {new Date(item.dt * 1000).toLocaleDateString('vi-VN', { weekday: 'short' })}
            </span>
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} 
                className="w-10 h-10 group-hover:scale-110 transition-transform" 
              />
              <span className="text-xs text-white/60 font-medium capitalize">
                {item.weather[0].description}
              </span>
            </div>
            <span className="font-black text-white text-right w-12">
              {Math.round(item.main.temp)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
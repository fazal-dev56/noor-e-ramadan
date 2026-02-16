import React, { useState, useEffect } from 'react';
import { AlAdhanResponse } from '../types';

interface TimeWidgetProps {
  data: AlAdhanResponse | null;
  loading: boolean;
}

export const TimeWidget: React.FC<TimeWidgetProps> = ({ data, loading }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Split time to style AM/PM differently
  const [timeDigits, period] = formattedTime.split(' ');

  if (loading || !data) {
    return (
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full max-w-2xl mx-auto mb-4">
        <div className="h-20 w-full md:w-1/2 bg-white/10 animate-pulse rounded-xl backdrop-blur-md"></div>
        <div className="h-20 w-full md:w-1/2 bg-white/10 animate-pulse rounded-xl backdrop-blur-md"></div>
      </div>
    );
  }

  const { date, timings } = data.data;

  const formatTo12Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const time = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHour = hours < 10 ? `0${hours}` : hours;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 justify-center items-stretch w-full max-w-3xl mx-auto mb-2 md:mb-6 px-0 md:px-4">
      
      {/* Time & Gregorian Date Card */}
      <div className="flex-1 bg-gradient-to-br from-amber-900/80 to-black/80 border border-amber-500/30 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-[0_0_20px_rgba(217,119,6,0.15)] flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
            <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div className="text-3xl md:text-6xl font-bold font-mono text-amber-100 tracking-wider drop-shadow-lg z-10 whitespace-nowrap">
          {timeDigits}
          <span className="text-sm md:text-3xl text-amber-500 ml-1 font-serif">{period}</span>
        </div>
        <div className="text-amber-200/80 mt-1 md:mt-2 font-medium text-xs md:text-lg z-10 text-center leading-tight">
          {date.gregorian.weekday.en}, {date.gregorian.day} {date.gregorian.month.en}
        </div>
      </div>

      {/* Location & Sun Info Card */}
      <div className="flex-1 bg-gradient-to-bl from-amber-100/90 to-amber-200/90 text-amber-900 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col justify-center md:justify-between relative overflow-hidden gap-2 md:gap-0">
        
        {/* City Badge - Compact for Mobile */}
        <div className="flex justify-between items-center md:items-start md:mb-4">
            <div className="bg-amber-900/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-amber-900/20">
                <span className="font-bold text-[10px] md:text-sm uppercase tracking-wide">Bahawalpur</span>
            </div>
            <svg className="w-4 h-4 md:w-8 md:h-8 text-amber-600 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>

        <div className="space-y-1 md:space-y-3">
          <div className="flex justify-between items-center border-b border-amber-900/10 pb-1 md:pb-2">
            <span className="font-semibold text-xs md:text-lg flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Sunrise
            </span>
            <span className="font-bold text-xs md:text-xl font-mono">{formatTo12Hour(timings.Sunrise)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-xs md:text-lg flex items-center gap-1 md:gap-2">
                <svg className="w-3 h-3 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                Sunset
            </span>
            <span className="font-bold text-xs md:text-xl font-mono">{formatTo12Hour(timings.Sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
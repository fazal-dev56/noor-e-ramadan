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
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full max-w-2xl mx-auto mb-10">
        <div className="h-32 w-full md:w-1/2 bg-white/10 animate-pulse rounded-xl backdrop-blur-md"></div>
        <div className="h-32 w-full md:w-1/2 bg-white/10 animate-pulse rounded-xl backdrop-blur-md"></div>
      </div>
    );
  }

  const { date, timings } = data.data;

  // Function to convert 24h string (e.g. "18:05") to 12h format (e.g. "06:05 PM")
  const formatTo12Hour = (timeStr: string) => {
    if (!timeStr) return '';
    // Remove timezone info like (PKT)
    const time = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [hoursStr, minutesStr] = time.split(':');
    
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const formattedHour = hours < 10 ? `0${hours}` : hours;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch w-full max-w-3xl mx-auto mb-12 px-4">
      
      {/* Time & Gregorian Date Card */}
      <div className="flex-1 bg-gradient-to-br from-amber-900/80 to-black/80 border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(217,119,6,0.15)] flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div className="text-5xl md:text-6xl font-bold font-mono text-amber-100 tracking-wider drop-shadow-lg z-10">
          {timeDigits}
          <span className="text-2xl md:text-3xl text-amber-500 ml-2 font-serif">{period}</span>
        </div>
        <div className="text-amber-200/80 mt-2 font-medium text-lg z-10">
          {date.gregorian.weekday.en}, {date.gregorian.day} {date.gregorian.month.en} {date.gregorian.year}
        </div>
      </div>

      {/* Location & Sun Info Card */}
      <div className="flex-1 bg-gradient-to-bl from-amber-100/90 to-amber-200/90 text-amber-900 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex flex-col justify-between relative overflow-hidden">
        
        {/* City Badge */}
        <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-900/10 px-3 py-1 rounded-full border border-amber-900/20">
                <span className="font-bold text-sm uppercase tracking-wide">Bahawalpur</span>
            </div>
            <svg className="w-8 h-8 text-amber-600 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-amber-900/10 pb-2">
            <span className="font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Sunrise
            </span>
            <span className="font-bold text-xl font-mono">{formatTo12Hour(timings.Sunrise)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                Sunset
            </span>
            <span className="font-bold text-xl font-mono">{formatTo12Hour(timings.Sunset)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
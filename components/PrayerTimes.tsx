import React from 'react';
import { AlAdhanResponse } from '../types';

interface PrayerTimesProps {
  data: AlAdhanResponse | null;
  loading: boolean;
}

export const PrayerTimes: React.FC<PrayerTimesProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="w-full max-w-3xl mx-auto h-16 bg-white/5 animate-pulse rounded-xl backdrop-blur-sm mb-4"></div>
    );
  }

  const { timings } = data.data;

  const prayers = [
    { label: 'Fajr', time: timings.Fajr },
    { label: 'Dhuhr', time: timings.Dhuhr },
    { label: 'Asr', time: timings.Asr },
    { label: 'Maghrib', time: timings.Maghrib },
    { label: 'Isha', time: timings.Isha },
  ];

  const formatTime = (timeStr: string) => {
    // Remove timezone suffix if any
    const cleanTime = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [hours, minutes] = cleanTime.split(':');
    let hour = parseInt(hours, 10);
    // Convert to 12h format without AM/PM to keep it minimal as requested
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minutes}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-2 md:mb-4 px-2 md:px-4">
      <div className="flex justify-between items-center bg-black/30 backdrop-blur-md rounded-xl border border-amber-500/10 py-3 px-3 md:px-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        {prayers.map((prayer) => (
          <div key={prayer.label} className="flex flex-col items-center gap-0.5 md:gap-1 group cursor-default">
            <span className="text-[9px] md:text-xs font-serif font-semibold text-amber-500/70 uppercase tracking-widest group-hover:text-amber-400 transition-colors">
              {prayer.label}
            </span>
            <span className="text-xs md:text-lg font-bold text-amber-100/90 font-mono group-hover:text-white transition-colors">
              {formatTime(prayer.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

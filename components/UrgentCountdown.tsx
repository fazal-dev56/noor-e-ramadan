import React, { useState, useEffect } from 'react';
import { AlAdhanResponse } from '../types';

interface UrgentCountdownProps {
  data: AlAdhanResponse | null;
  hidden: boolean;
}

export const UrgentCountdown: React.FC<UrgentCountdownProps> = ({ data, hidden }) => {
  const [status, setStatus] = useState<{ type: 'Sehri' | 'Iftar'; timeLeft: string } | null>(null);

  useEffect(() => {
    if (!data) return;

    const checkTime = () => {
      const now = new Date();
      const { Fajr, Maghrib } = data.data.timings;
      
      const parseTime = (t: string) => {
        const clean = t.replace(/\s*\(.*\)/, '').trim();
        const [h, m] = clean.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
      };

      const fajrTime = parseTime(Fajr);
      const maghribTime = parseTime(Maghrib);
      
      const check = (target: Date, name: 'Sehri' | 'Iftar') => {
        const diff = target.getTime() - now.getTime();
        // 2 minutes = 120000 ms
        if (diff > 0 && diff <= 120000) {
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            return {
                type: name,
                timeLeft: `${m}:${s < 10 ? '0' : ''}${s}`
            };
        }
        return null;
      };

      const sehriCheck = check(fajrTime, 'Sehri');
      const iftarCheck = check(maghribTime, 'Iftar');

      setStatus(sehriCheck || iftarCheck);
    };

    const interval = setInterval(checkTime, 1000);
    checkTime(); // Initial check

    return () => clearInterval(interval);
  }, [data]);

  if (hidden || !status) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 my-2 flex-1 flex items-center justify-center animate-pulse">
       <div className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.6)] border-2 border-red-400 flex flex-col items-center justify-center backdrop-blur-md transform transition-all hover:scale-105">
          <p className="text-xl md:text-2xl uppercase tracking-[0.3em] font-bold text-red-100 mb-2 animate-pulse">
            {status.type === 'Sehri' ? 'Sehri Ends In' : 'Iftar Time In'}
          </p>
          <div className="text-7xl md:text-9xl font-mono font-bold tracking-tighter drop-shadow-2xl">
            {status.timeLeft}
          </div>
          <p className="text-sm md:text-base text-red-200 mt-4 font-serif italic opacity-90">Only 2 minutes remaining...</p>
       </div>
    </div>
  );
};
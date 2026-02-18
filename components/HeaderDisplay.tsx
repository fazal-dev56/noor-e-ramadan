import React from 'react';
import { AlAdhanResponse } from '../types';

interface HeaderDisplayProps {
  data: AlAdhanResponse | null;
  loading: boolean;
}

export const HeaderDisplay: React.FC<HeaderDisplayProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-16 w-3/4 mx-auto bg-white/10 animate-pulse rounded-lg backdrop-blur-md mb-4"></div>
    );
  }

  if (!data) return null;

  const { hijri } = data.data.date;
  
  // Check if current day is the last day of the month using the 'days' property from API
  const currentDay = parseInt(hijri.day, 10);
  const isAdjusting = currentDay === 1;

  return (
    <div className="text-center relative z-10 mb-2 md:mb-8 transform transition-all duration-700 hover:scale-105">
      <div className="inline-block relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-amber-900/20 blur-xl rounded-full"></div>
        <h1 className="relative text-2xl md:text-6xl font-serif font-bold text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-amber-500/50 pb-1 md:pb-2 px-6 md:px-8 bg-black/30 backdrop-blur-sm rounded-xl">
          {isAdjusting ? (
             <span className="text-amber-500 animate-pulse tracking-widest">Adjusting!</span>
          ) : (
             <>
               <span className="text-amber-500">{hijri.day -1 }</span> {hijri.month.en} <span className="hidden md:inline">, {hijri.year}</span>
             </>
          )}
        </h1>
        <p className="text-amber-300/80 mt-1 md:mt-2 font-arabic text-lg md:text-xl">
            {hijri.month.ar} <span className="md:hidden text-sm font-serif text-amber-400/60 ml-2">{hijri.year}</span>
        </p>
      </div>
    </div>
  );
};
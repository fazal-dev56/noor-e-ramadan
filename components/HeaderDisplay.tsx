import React from 'react';
import { AlAdhanResponse } from '../types';

interface HeaderDisplayProps {
  data: AlAdhanResponse | null;
  loading: boolean;
}

export const HeaderDisplay: React.FC<HeaderDisplayProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-20 w-3/4 mx-auto bg-white/10 animate-pulse rounded-lg backdrop-blur-md mb-8"></div>
    );
  }

  if (!data) return null;

  const { hijri } = data.data.date;

  return (
    <div className="text-center relative z-10 mb-8 transform transition-all duration-700 hover:scale-105">
      <div className="inline-block relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-600/20 to-amber-900/20 blur-xl rounded-full"></div>
        <h1 className="relative text-4xl md:text-6xl font-serif font-bold text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-b-2 border-amber-500/50 pb-2 px-8 bg-black/30 backdrop-blur-sm rounded-xl">
          <span className="text-amber-500">{hijri.day}</span> {hijri.month.en}, {hijri.year}
        </h1>
        <p className="text-amber-300/80 mt-2 font-arabic text-xl">{hijri.month.ar}</p>
      </div>
    </div>
  );
};
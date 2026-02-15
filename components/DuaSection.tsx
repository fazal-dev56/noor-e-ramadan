import React, { useState } from 'react';
import { TabType } from '../types';

interface DuaContent {
  title: string;
  arabic: string;
  urdu: string;
  english: string;
}

const content: Record<TabType, DuaContent | string> = {
  sehri: {
    title: "Dua for Sehri (Intention for Fast)",
    arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    urdu: "اور میں نے ماہ رمضان کے کل کے روزے کی نیت کی۔",
    english: "I intend to keep the fast for tomorrow in the month of Ramadan."
  },
  aftari: {
    title: "Dua for Iftar (Breaking Fast)",
    arabic: "اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ اَمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ",
    urdu: "اے اللہ! میں نے تیرے لیے روزہ رکھا اور تیرے اوپر ایمان لایا اور تجھ پر بھروسہ کیا اور تیرے رزق سے افطار کیا۔",
    english: "O Allah! I fasted for You and I believe in You and I put my trust in You and I break my fast with Your sustenance."
  },
  note: "May this holy month of Ramadan bring you closer to Allah. Remember the less fortunate in your prayers and charity. May your fasts be accepted and your sins forgiven. Ameen."
};

export const DuaSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('sehri');

  // Calculations for arrow position based on flex grid
  const getArrowPosition = () => {
    switch (activeTab) {
      case 'sehri': return 'left-[16%] md:left-[16%]';
      case 'aftari': return 'left-[50%] md:left-[50%]';
      case 'note': return 'left-[84%] md:left-[84%]';
    }
  };

  const renderContent = () => {
    const data = content[activeTab];
    if (typeof data === 'string') {
      return (
        <div className="text-center h-full flex flex-col justify-center items-center p-4">
          <h3 className="text-2xl font-serif font-bold text-amber-900 mb-4 border-b-2 border-amber-900/20 pb-2">Ramadan Note</h3>
          <p className="text-lg md:text-xl leading-relaxed font-medium italic text-amber-800">"{data}"</p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-amber-900 opacity-80 uppercase tracking-widest text-xs md:text-sm mb-2">{data.title}</h3>
        <p className="text-2xl md:text-4xl font-arabic leading-loose text-amber-900 drop-shadow-sm py-2" dir="rtl">{data.arabic}</p>
        <div className="space-y-2 mt-4 pt-4 border-t border-amber-900/10">
            <p className="text-lg md:text-xl font-medium text-amber-800 font-serif" dir="rtl">{data.urdu}</p>
            <p className="text-sm md:text-base text-amber-700 italic">{data.english}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-20">
      
      {/* Tabs */}
      <div className="flex justify-between items-center gap-4 mb-6 relative">
        {(['sehri', 'aftari', 'note'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 py-3 px-2 rounded-lg font-bold text-sm md:text-lg transition-all duration-300 transform
              ${activeTab === tab 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-105 -translate-y-1' 
                : 'bg-white/10 text-amber-100 hover:bg-white/20 hover:text-white'}
              uppercase tracking-wide font-sans
            `}
          >
            {tab === 'sehri' ? 'Dua e Sehri' : tab === 'aftari' ? 'Dua e Aftari' : 'Note!'}
          </button>
        ))}
      </div>

      {/* Content Box with Arrow */}
      <div className="relative">
        {/* Animated Arrow */}
        <div 
          className={`absolute -top-3 w-6 h-6 bg-amber-500 transform rotate-45 transition-all duration-500 ease-in-out border-t border-l border-amber-400 shadow-[-2px_-2px_4px_rgba(0,0,0,0.1)] z-20 -ml-3 ${getArrowPosition()}`}
        ></div>

        {/* Card Body */}
        <div className="bg-gradient-to-b from-amber-500 to-amber-600 rounded-2xl p-1 shadow-2xl relative z-10 transition-all duration-500">
           <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 md:p-8 min-h-[300px] flex items-center justify-center shadow-inner">
             <div className="w-full animate-fadeIn transition-opacity duration-500">
               {renderContent()}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
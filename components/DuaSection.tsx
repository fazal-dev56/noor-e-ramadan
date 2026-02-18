import React, { useState, useEffect, useRef } from 'react';
import { TabType, AlAdhanResponse } from '../types';

interface DuaContent {
  title: string;
  arabic: string;
  urdu: string;
  english: string;
}

interface DuaSectionProps {
  data: AlAdhanResponse | null;
  onOpenChange?: (isOpen: boolean) => void;
}

const content: Record<TabType, DuaContent | string> = {
  sehri: {
    title: "Dua for Sehri",
    arabic: "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
    urdu: "اور میں نے ماہ رمضان کے کل کے روزے کی نیت کی۔",
    english: "I intend to keep the fast for tomorrow in the month of Ramadan."
  },
  aftari: {
    title: "Dua for Iftar",
    arabic: "اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ اَمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ",
    urdu: "اے اللہ! میں نے تیرے لیے روزہ رکھا اور تیرے اوپر ایمان لایا اور تجھ پر بھروسہ کیا اور تیرے رزق سے افطار کیا۔",
    english: "O Allah! I fasted for You and I believe in You."
  },
  about: "As-Sawm serves as your spiritual companion."
};

export const DuaSection: React.FC<DuaSectionProps> = ({ data, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('sehri');
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Notify parent of open state changes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setIsOpen(true);

    // Reset the auto-close timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 60000); // 1 minute
  };

  // Calculations for arrow position based on flex grid
  const getArrowPosition = () => {
    switch (activeTab) {
      case 'sehri': return 'left-[16%] md:left-[16%]';
      case 'aftari': return 'left-[50%] md:left-[50%]';
      case 'about': return 'left-[84%] md:left-[84%]';
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const cleanTime = timeStr.replace(/\s*\(.*\)/, '').trim();
    const [hours, minutes] = cleanTime.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const renderContent = () => {
    if (activeTab === 'about') {
        return (
          <div className="text-center flex flex-col justify-center items-center h-full animate-fadeIn py-2">
            <h3 className="text-lg md:text-2xl font-serif font-bold text-amber-900 mb-2 md:mb-4 border-b-2 border-amber-900/20 pb-1 md:pb-2">About As-Sawm</h3>
            
            <div className="flex-1 flex flex-col justify-center gap-2 md:gap-4 overflow-y-auto max-h-[150px] md:max-h-none">
              <p className="text-sm md:text-lg leading-relaxed font-medium text-amber-800 px-2">
                As-Sawm is your minimal, elegant companion for fasting.
              </p>
              <p className="text-sm md:text-lg leading-relaxed font-medium text-amber-900 px-1">
                While crafted with the spirit of Ramadan in mind, this app is designed to provide accurate <span className="font-bold text-amber-950 bg-amber-400/20 px-1 rounded">Sehri and Iftar timings all year round</span>, supporting your voluntary fasts and spiritual journey continuously.
              </p>
            </div>
            
            {/* Feedback Button */}
            <a 
              href="https://wa.me/923055642796"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-3 flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs md:text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 mx-auto no-underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
              <span>Feedback</span>
            </a>
  
            <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-amber-900/10 w-3/4 mx-auto flex-none">
               <p className="text-[10px] md:text-xs text-amber-700/70 uppercase tracking-widest mb-0.5">Crafted with care</p>
               <p className="text-sm md:text-base font-bold text-amber-900 font-mono tracking-wide">@madebyfazal</p>
            </div>
          </div>
        );
    }

    const contentData = content[activeTab] as DuaContent;

    // Determine if we should show a time
    let timeDisplay = null;
    let timeLabel = "";

    if (data && data.data && data.data.timings) {
      if (activeTab === 'sehri') {
        timeLabel = "SEHRI ENDS";
        timeDisplay = formatTime(data.data.timings.Fajr);
      } else if (activeTab === 'aftari') {
        timeLabel = "IFTAR TIME";
        timeDisplay = formatTime(data.data.timings.Maghrib);
      }
    }

    return (
      <div className="text-center space-y-1 md:space-y-4 pb-4">
        
        {/* Time Display for Sehri/Iftar */}
        {timeDisplay && (
          <div className="flex flex-col items-center justify-center mb-2 md:mb-4 pb-2 border-b border-amber-900/10 w-full animate-fadeIn">
            <span className="text-[10px] md:text-xs font-bold text-amber-800/60 tracking-[0.2em] mb-0.5">{timeLabel}</span>
            <span className="text-3xl md:text-5xl font-mono font-bold text-amber-900 drop-shadow-md tracking-tight">{timeDisplay}</span>
          </div>
        )}

        <h3 className="text-xs md:text-xl font-bold text-amber-900 opacity-80 uppercase tracking-widest mb-1 md:mb-2">{contentData.title}</h3>
        <p className="text-xl md:text-4xl font-arabic leading-relaxed md:leading-loose text-amber-900 drop-shadow-sm py-1 md:py-2" dir="rtl">{contentData.arabic}</p>
        <div className="space-y-1 md:space-y-2 mt-2 md:mt-4 pt-2 md:pt-4 border-t border-amber-900/10">
            <p className="text-sm md:text-xl font-medium text-amber-800 font-serif" dir="rtl">{contentData.urdu}</p>
            <p className="text-[10px] md:text-base text-amber-700 italic leading-tight">{contentData.english}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-0 md:px-4 flex flex-col h-full">
      
      {/* Tabs - Fixed height */}
      <div className="flex-none w-full flex justify-between items-center gap-2 md:gap-4 mb-3 md:mb-4 relative px-4 md:px-0">
        {(['sehri', 'aftari', 'about'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`
              flex-1 py-2 md:py-3 px-1 md:px-2 rounded-lg font-bold text-xs md:text-lg transition-all duration-300 transform
              ${isOpen && activeTab === tab 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-105 -translate-y-1' 
                : 'bg-white/10 text-amber-100 hover:bg-white/20 hover:text-white'}
              uppercase tracking-wide font-sans
            `}
          >
            {tab === 'sehri' ? 'Sehri' : tab === 'aftari' ? 'Aftari' : 'About'}
          </button>
        ))}
      </div>

      {/* Content Box - Fills remaining vertical space */}
      <div 
        className={`
          flex-1 min-h-0 relative transition-all duration-700 ease-in-out w-full
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        {/* Animated Arrow */}
        <div 
          className={`absolute -top-2 md:-top-3 w-4 h-4 md:w-6 md:h-6 bg-amber-500 transform rotate-45 transition-all duration-500 ease-in-out border-t border-l border-amber-400 shadow-[-2px_-2px_4px_rgba(0,0,0,0.1)] z-20 -ml-2 md:-ml-3 ${getArrowPosition()}`}
        ></div>

        {/* Card Body - Absolute positioning to fill the flex-1 parent properly */}
        <div className="absolute inset-0 pb-4 md:pb-6 px-2 md:px-0">
            <div className="h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-xl md:rounded-2xl p-0.5 md:p-1 shadow-2xl flex flex-col">
                <div className="flex-1 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg md:rounded-xl shadow-inner overflow-hidden flex flex-col">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-8">
                        <div key={activeTab} className="animate-fadeIn h-full">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
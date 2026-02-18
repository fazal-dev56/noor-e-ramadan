import React, { useEffect, useState } from 'react';
import { Lantern } from './components/Lantern';
import { HeaderDisplay } from './components/HeaderDisplay';
import { TimeWidget } from './components/TimeWidget';
import { PrayerTimes } from './components/PrayerTimes';
import { DuaSection } from './components/DuaSection';
import { InstallPwaButtons } from './components/InstallPwaButtons';
import { getTimingsByCity } from './services/alAdhanService';
import { AlAdhanResponse } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AlAdhanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Wake Lock for Screen
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // Cast navigator to any because wakeLock types might not be in the default TS lib
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock is active');
        } catch (err: any) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    // Request wake lock on mount
    requestWakeLock();

    // Re-request wake lock if visibility changes (e.g. user switches tabs and comes back)
    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTimingsByCity('Bahawalpur', 'Pakistan');
        setData(result);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-slate-950 font-sans text-gray-100 selection:bg-amber-500 selection:text-black">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2894&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
      
      {/* Stars Overlay */}
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                opacity: Math.random()
              }}
            />
         ))}
      </div>

      {/* Hanging Lanterns - Adjusted for compact view */}
      <div className="absolute top-0 w-full flex justify-between px-4 md:px-20 z-10 pointer-events-none">
        <Lantern className="left-4 md:left-32 scale-50 md:scale-100 -mt-2 md:mt-0" delay="0s" />
        <Lantern className="right-4 md:right-32 scale-75 md:scale-110 -mt-8 md:-mt-10" delay="2s" />
        <Lantern className="hidden md:block left-1/2 -ml-12 scale-125 -mt-4" delay="1s" />
      </div>

      {/* Main Content Container - Flex Column to fill height without scroll */}
      <main className="relative z-10 container mx-auto h-full flex flex-col justify-start items-center pt-16 md:pt-40 pb-2 px-4 gap-2 md:gap-4">
        
        {/* Islamic Date Header */}
        <div className="flex-none">
            <HeaderDisplay data={data} loading={loading} />
        </div>

        {/* Time and Location */}
        <div className="w-full flex-none">
            <TimeWidget data={data} loading={loading} />
        </div>

        {/* Prayer Times Horizontal List */}
        <div className="w-full flex-none">
            <PrayerTimes data={data} loading={loading} />
        </div>

        {/* Dua Tabs Section - Takes remaining space and aligns to top */}
        <div className="w-full flex-1 min-h-0 flex flex-col justify-start mt-2">
            <DuaSection data={data} />
        </div>
        
        {/* Install Buttons - Only visible on mobile via internal logic/css */}
        <InstallPwaButtons />

        {/* Footer / Crescent Moon Decoration - Made smaller/subtle */}
        <div className="fixed bottom-0 left-0 -mb-10 -ml-10 md:-mb-20 md:-ml-20 pointer-events-none opacity-30 mix-blend-screen z-0">
           <div className="w-40 h-40 md:w-80 md:h-80 rounded-full border-r-[15px] md:border-r-[30px] border-b-[5px] md:border-b-[10px] border-amber-400 blur-sm shadow-[0_0_50px_rgba(251,191,36,0.4)] transform -rotate-45"></div>
        </div>

      </main>
    </div>
  );
};

export default App;
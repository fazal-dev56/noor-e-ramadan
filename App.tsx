import React, { useEffect, useState, useCallback } from 'react';
import { Lantern } from './components/Lantern';
import { HeaderDisplay } from './components/HeaderDisplay';
import { TimeWidget } from './components/TimeWidget';
import { PrayerTimes } from './components/PrayerTimes';
import { DuaSection } from './components/DuaSection';
import { UrgentCountdown } from './components/UrgentCountdown';
import { InstallPwaButtons } from './components/InstallPwaButtons';
import { getTimingsByCity, getTimingsByCoordinates } from './services/alAdhanService';
import { AlAdhanResponse } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AlAdhanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLanterns, setShowLanterns] = useState(false);
  const [isDuaOpen, setIsDuaOpen] = useState(false);
  
  // Location state
  const [locationName, setLocationName] = useState('Bahawalpur');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  // Helper function to enter fullscreen
  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const elem = document.documentElement as any;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
          await elem.msRequestFullscreen();
        }
      }
    } catch (err) {
      console.log('Fullscreen request failed (likely needs user gesture):', err);
    }
  };

  // Wake Lock and Fullscreen Logic
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // Cast navigator to any because wakeLock types might not be in the default TS lib
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock is active');
        } catch (err: any) {
          // Silently ignore NotAllowedError as it often happens due to permissions policy or lack of user gesture
          if (err.name !== 'NotAllowedError') {
             console.warn(`Wake Lock failed: ${err.message}`);
          }
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

    // Interaction handler to trigger things that require user gestures (Audio, Fullscreen, WakeLock)
    const handleInteraction = () => {
        if (!wakeLock) {
            requestWakeLock();
        }
        // Trigger fullscreen on first interaction
        enterFullscreen();
    };
    
    // Attempt fullscreen after 2 seconds (note: browsers may block this without interaction)
    const fsTimer = setTimeout(() => {
      enterFullscreen();
    }, 2000);

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });


    return () => {
      clearTimeout(fsTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, []);

  // Show lanterns after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanterns(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (coords) {
         result = await getTimingsByCoordinates(coords.lat, coords.lng);
      } else {
         result = await getTimingsByCity('Bahawalpur', 'Pakistan');
      }
      setData(result);
    } catch (error) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    // Re-trigger lanterns animation for that "reload" feel
    setShowLanterns(false);
    setTimeout(() => setShowLanterns(true), 3000);
    fetchData();
    // Also try fullscreen again on refresh button click
    enterFullscreen();
  };

  const handleLocationClick = () => {
    // If already using coordinates, maybe let them switch back or refresh location? 
    // For now, let's just refresh current location or ask permission if not set.
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationName("Current Location");
      },
      (error) => {
        setLoading(false); // Stop loading if error
        console.error("Error getting location", error);
        let msg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
            msg = "Location permission denied. Please allow location access to use this feature.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
            msg = "The request to get user location timed out.";
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

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

      {/* Manual Refresh Button */}
      <button 
        onClick={handleRefresh}
        className="absolute top-4 right-4 z-50 p-2 md:p-3 bg-black/20 hover:bg-amber-900/40 backdrop-blur-md rounded-full text-amber-500/70 hover:text-amber-400 transition-all border border-white/5 active:scale-95 group"
        aria-label="Refresh Data"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Hanging Lanterns - Adjusted for compact view with Fade In */}
      <div className={`absolute top-0 w-full flex justify-between px-4 md:px-20 z-10 pointer-events-none transition-opacity duration-1000 ease-in-out ${showLanterns ? 'opacity-100' : 'opacity-0'}`}>
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
            <TimeWidget 
              data={data} 
              loading={loading} 
              locationName={locationName} 
              onLocationClick={handleLocationClick} 
            />
        </div>

        {/* Prayer Times Horizontal List */}
        <div className="w-full flex-none">
            <PrayerTimes data={data} loading={loading} />
        </div>

        {/* Dua Tabs Section - Expands to fill space if open, otherwise flex-none */}
        <div className={`w-full flex flex-col justify-start mt-2 relative transition-all duration-300 ${isDuaOpen ? 'flex-1' : 'flex-none'}`}>
            <DuaSection data={data} onOpenChange={setIsDuaOpen} />
        </div>
        
        {/* Urgent Countdown - Appears between Dua Buttons and Install Buttons */}
        {/* This will take up remaining space if visible (it has flex-1 inside) */}
        <UrgentCountdown data={data} hidden={isDuaOpen} />
        
        {/* Install Buttons - Pushed to bottom */}
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
import React, { useEffect, useState } from 'react';

export const InstallPwaButtons: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Basic mobile detection
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    // Check if app is running in standalone mode (installed)
    const checkStandalone = () => {
        const isStandaloneMode = 
          window.matchMedia('(display-mode: standalone)').matches || 
          window.matchMedia('(display-mode: fullscreen)').matches || 
          window.matchMedia('(display-mode: minimal-ui)').matches || 
          (window.navigator as any).standalone === true;
        setIsStandalone(isStandaloneMode);
    };

    checkMobile();
    checkStandalone();
    window.addEventListener('resize', checkMobile);
    
    // Listen for display mode changes (covers standalone, fullscreen, minimal-ui)
    const mediaQueryStandalone = window.matchMedia('(display-mode: standalone)');
    const mediaQueryFullscreen = window.matchMedia('(display-mode: fullscreen)');
    
    mediaQueryStandalone.addEventListener('change', checkStandalone);
    mediaQueryFullscreen.addEventListener('change', checkStandalone);

    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', checkMobile);
      mediaQueryStandalone.removeEventListener('change', checkStandalone);
      mediaQueryFullscreen.removeEventListener('change', checkStandalone);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
    } else {
      // If no prompt available (iOS or already installed), show instructions
      setShowInstructions(true);
      setTimeout(() => setShowInstructions(false), 8000);
    }
  };

  // Don't render if not mobile OR if already installed
  if (!isMobile || isStandalone) return null;

  return (
    <div className="w-full flex-none px-4 z-30 relative mt-auto md:hidden pb-4">
      
      {/* Instructions Overlay */}
      <div 
        className={`absolute bottom-full left-0 right-0 mx-4 mb-2 bg-slate-800/95 backdrop-blur text-white p-4 rounded-xl shadow-2xl border border-white/10 transition-all duration-500 transform ${showInstructions ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-start gap-3">
            <div className="text-2xl pt-1">📲</div>
            <div className="flex-1">
              <p className="font-bold text-amber-400 mb-1">Add to Home Screen</p>
              <div className="space-y-1 text-xs text-gray-300">
                <p>1. Tap the Share button <span className="inline-flex items-center justify-center bg-gray-700 w-5 h-5 rounded mx-1 align-middle">⎋</span> or Menu <span className="inline-flex items-center justify-center bg-gray-700 w-5 h-5 rounded mx-1 align-middle">⋮</span></p>
                <p>2. Select <span className="font-bold text-white">"Add to Home Screen"</span></p>
              </div>
            </div>
            <button onClick={() => setShowInstructions(false)} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <div className="absolute bottom-[-6px] left-1/2 -ml-2 w-4 h-4 bg-slate-800/95 rotate-45 border-r border-b border-white/10"></div>
      </div>

      <div className="flex gap-2 justify-center">
        {/* Android Button */}
        <button 
          onClick={handleInstallClick}
          className="flex-1 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg py-2 px-1 flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-lg group"
        >
           <svg className="w-6 h-6 text-[#3DDC84] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1527-.5676.416.416 0 00-.5676.1527l-2.0225 3.503c-1.4669-.6743-3.1185-1.0664-4.8856-1.096l-.0895-.0025c-1.854.0296-3.5855.4452-5.1116 1.157L5.0449 5.4057a.4163.4163 0 00-.5677-.1527.4158.4158 0 00-.1526.5676l1.9791 3.4283C3.6062 10.7412 1.8385 13.199 1.8385 16h20.323c0-2.801-1.7677-5.2588-4.469-6.6786"/>
           </svg>
           <div className="text-left flex flex-col justify-center">
              <span className="text-[13px] font-bold leading-tight text-white font-sans">Get App</span>
           </div>
        </button>

        {/* iOS Button */}
        <button 
          onClick={handleInstallClick}
          className="flex-1 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg py-2 px-1 flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-lg group"
        >
           <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.388 14.167c.123 2.181 1.888 2.924 1.906 2.932-.016.053-.298 1.042-.98 2.05-.595.882-1.216 1.763-2.188 1.777-.959.014-1.266-.575-2.372-.575-1.107 0-1.45.56-2.355.589-.922.028-1.626-.937-2.215-1.801-1.205-1.763-2.126-4.996-.889-7.177.615-1.082 1.713-1.767 2.9-1.794.896-.021 1.737.609 2.285.609.548 0 1.577-.753 2.659-.642.453.018 1.725.185 2.54 1.393-.065.04-1.517.893-1.552 2.639m-2.127-6.938c.49-.604.82-1.442.73-2.28-.707.029-1.564.478-2.072 1.082-.456.536-.853 1.393-.746 2.214.79.062 1.597-.406 2.088-1.016"/>
           </svg>
           <div className="text-left flex flex-col justify-center">
              <span className="text-[13px] font-bold leading-tight text-white font-sans">Get App</span>
           </div>
        </button>
      </div>
    </div>
  );
};
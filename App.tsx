import React, { useEffect, useState } from "react";
import { Lantern } from "./components/Lantern";
import { HeaderDisplay } from "./components/HeaderDisplay";
import { TimeWidget } from "./components/TimeWidget";
import { DuaSection } from "./components/DuaSection";
import { getTimingsByCity } from "./services/alAdhanService";
import { AlAdhanResponse } from "./types";

const App: React.FC = () => {
  const [data, setData] = useState<AlAdhanResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTimingsByCity("Bahawalpur", "Pakistan");
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
    <div className="min-h-screen w-full relative overflow-x-hidden bg-slate-950 font-sans text-gray-100 selection:bg-amber-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2894&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>

      {/* Stars Overlay (CSS generated) */}
      <div className="fixed inset-0 z-0 opacity-60">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              opacity: Math.random(),
            }}
          />
        ))}
      </div>

      {/* Hanging Lanterns */}
      <div className="absolute top-0 w-full flex justify-between px-4 md:px-20 z-10 pointer-events-none">
        <Lantern
          className="left-10 md:left-32 scale-75 md:scale-100"
          delay="0s"
        />
        <Lantern
          className="right-10 md:right-32 scale-90 md:scale-110 -mt-10"
          delay="2s"
        />
        <Lantern
          className="hidden md:block left-1/2 -ml-12 scale-125 -mt-4"
          delay="1s"
        />
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 container mx-auto pt-32 md:pt-40 px-4 flex flex-col items-center min-h-screen">
        {/* Islamic Date Header */}
        <HeaderDisplay data={data} loading={loading} />

        {/* Time and Location */}
        <TimeWidget data={data} loading={loading} />

        {/* Dua Tabs Section */}
        <DuaSection />

        {/* Footer / Crescent Moon Decoration */}
        <div className="fixed bottom-0 left-0 -mb-20 -ml-20 pointer-events-none opacity-40 mix-blend-screen z-0">
          <div className="w-80 h-80 rounded-full border-r-[30px] border-b-[10px] border-amber-400 blur-sm shadow-[0_0_50px_rgba(251,191,36,0.4)] transform -rotate-45"></div>
        </div>
      </main>
    </div>
  );
};

export default App;

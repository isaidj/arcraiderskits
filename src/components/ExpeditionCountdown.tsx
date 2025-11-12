"use client";

import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";

// Configuración de la fecha de finalización de la expedición
// Fecha de finalización de la primera expedición
const EXPEDITION_END_DATE = process.env.NEXT_PUBLIC_EXPEDITION_END_DATE || "2025-12-21T23:59:59";
const EXPEDITION_START_DATE = "2025-10-27T00:00:00"; // Fecha de inicio de la expedición

export default function ExpeditionCountdown() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const calculateProgress = () => {
      const now = new Date().getTime();
      const start = new Date(EXPEDITION_START_DATE).getTime();
      const end = new Date(EXPEDITION_END_DATE).getTime();

      const totalDuration = end - start;
      const elapsed = now - start;
      const percentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

      setProgress(percentage);
    };

    calculateProgress();
    const interval = setInterval(calculateProgress, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-[#e9e1cd]">ARC RAIDERS</h1>
        <div className="h-1 w-24 bg-linear-to-r from-red-600 to-orange-500 mb-8"></div>

        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#e5a10f]">EXPEDITION 1</h2>

        {/* Countdown */}
        <CountdownTimer
          targetDate={EXPEDITION_END_DATE}
          labels={{
            days: "Days",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
          }}
        />

        {/* Progress Bar */}
        <div className="w-full max-w-2xl mx-auto mb-6 px-4">
          <div className="relative">
            {/* Progress bar background */}
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-red-600/30">
              {/* Progress bar fill */}
              <div className="h-full bg-linear-to-r from-red-600 via-orange-500 to-red-600 transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            {/* Progress percentage */}
            <div className="flex justify-between mt-2 text-xs text-red-400/80 font-mono">
              <span>Expedition Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <p className="text-lg md:text-xl mb-4 text-[#e9e1cd]">Ends on December 21, 2025</p>

        {/* Expedition Info */}
        <div className="max-w-2xl mx-auto mb-12 px-4">
          <p className="text-sm md:text-base leading-relaxed text-[#e9e1cd]">
            The Expedition is a voluntary reset system that runs in 8-week cycles. By completing it, you can send your Raider beyond the Rust Belt, resetting your progress but
            keeping permanent rewards and advantages for your next Raider.
          </p>
        </div>

        {/* Bottom Text */}
        <p className="mt-4 text-sm md:text-base uppercase tracking-widest text-[#e9e1cd]">Enlist. Resist.</p>
      </main>
    </div>
  );
}

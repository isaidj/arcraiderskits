'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function CountdownTimer({ targetDate, labels }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-4 gap-4 md:gap-8 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="countdown-item">
            <div className="relative bg-black border-2 border-red-600 rounded-lg p-6 md:p-8 min-w-20 md:min-w-[120px] overflow-hidden">
              <div className="relative text-4xl md:text-6xl font-bold text-red-500 mb-2 font-mono">
                00
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: labels.days },
    { value: timeLeft.hours, label: labels.hours },
    { value: timeLeft.minutes, label: labels.minutes },
    { value: timeLeft.seconds, label: labels.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-8 mb-8">
      {timeUnits.map((unit, index) => (
        <div key={index} className="countdown-item">
          <div className="relative bg-black border-2 border-red-600 rounded-lg p-6 md:p-8 min-w-20 md:min-w-[120px] overflow-hidden group">
            {/* Retro scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-red-500/10 to-transparent animate-scan"></div>
            </div>
            {/* CRT glow */}
            <div className="absolute inset-0 bg-red-600/5 blur-xl"></div>
            <div className="relative text-4xl md:text-6xl font-bold text-red-500 mb-2 font-mono drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="relative text-xs md:text-sm text-red-400/80 uppercase tracking-wider font-mono">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

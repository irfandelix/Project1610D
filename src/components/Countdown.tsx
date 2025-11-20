"use client";

import { useState, useEffect } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  // Fungsi untuk membuat kotak angka digital
  const DigitalBlock = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-4">
      {/* Container Angka (Pake Grid biar numpuk) */}
      <div className="relative grid place-items-center">
        
        {/* LAYER 1: Angka 88 (Bayangan Mati/Abu-abu) */}
        {/* <div className="font-digital text-[12vw] md:text-[150px] text-[#1a1a1a] leading-none select-none col-start-1 row-start-1 z-0">
          88
        </div> */}

        {/* LAYER 2: Angka Asli (Menyala Putih) */}
        <div className="font-digital text-[12vw] md:text-[150px] text-white leading-none col-start-1 row-start-1 z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {String(value).padStart(2, "0")}
        </div>

      </div>
    
      
      {/* Label Kecil di bawah */}
      <span className="text-[20px] md:text-sm font-sans text-gray-500 tracking-[0.2em] mt-2 md:mt-4 uppercase">
        {label}
      </span>
    </div>
  );

  // Titik Dua (:) yang berkedip
  const Separator = () => (
    <div className="flex flex-col justify-center h-[12vw] md:h-[150px] pb-4 md:pb-8">
       <span className="font-digital text-[8vw] md:text-[100px] text-gray-600 animate-pulse">:</span>
    </div>
  );

  return (
    <div className="flex items-start justify-center w-full max-w-[95vw]">
      <DigitalBlock value={timeLeft.days} label="Hari" />
      <Separator />
      <DigitalBlock value={timeLeft.hours} label="Jam" />
      <Separator />
      <DigitalBlock value={timeLeft.minutes} label="Menit" />
      <Separator />
      <DigitalBlock value={timeLeft.seconds} label="Detik" />
    </div>
  );
}
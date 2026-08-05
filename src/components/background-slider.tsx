'use client';

import React, { useState, useEffect } from 'react';

interface BackgroundSliderProps {
  images: string[];
  interval?: number;
}

export default function BackgroundSlider({ images, interval = 5000 }: BackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {images.map((imgUrl, index) => (
        <div
          key={imgUrl + index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url('${imgUrl}')`,
            transitionProperty: 'opacity, transform',
            transitionDuration: '1000ms',
          }}
        />
      ))}
      {/* Overlay sombre pour garder le texte lisible */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950" />
    </div>
  );
}
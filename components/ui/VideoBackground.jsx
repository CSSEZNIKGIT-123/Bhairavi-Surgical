'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function VideoBackground({
  videoSrc,
  fallbackVideoSrc,
  posterSrc,
  posterAlt = 'Hero Background',
  overlayClassName = 'bg-gradient-to-r from-[#141F16]/95 via-[#18281B]/80 to-[#141F16]/60',
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict DOM attribute enforcement for mobile and desktop browser autoplay
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const handlePlaying = () => {
      setIsPlaying(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    // Trigger playback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          // Autoplay restricted or source load error -> gracefully fallback to poster
          console.warn('Hero video autoplay fallback to high-res poster:', err?.message || err);
          setIsPlaying(false);
        });
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {/* High-Resolution Poster Image (Always rendered as immediate foundation) */}
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center transition-opacity duration-700 ${
          isPlaying ? 'opacity-90' : 'opacity-100'
        }`}
      />

      {/* HTML5 Video Element with smooth opacity reveal */}
      {!hasError && videoSrc && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
          {fallbackVideoSrc && <source src={fallbackVideoSrc} type="video/mp4" />}
        </video>
      )}

      {/* Dual Gradient Overlay System for Perfect Visual Hierarchy & Readability */}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
    </div>
  );
}

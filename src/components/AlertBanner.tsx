'use client';

import { useState, useEffect } from 'react';
import { Earthquake } from '@/types';

interface AlertBannerProps {
  alerts: Earthquake[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (alerts.length <= 1) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(t);
  }, [alerts.length]);

  if (!alerts.length || !visible) return null;

  const alert = alerts[current];

  return (
    <div className="bg-red-950/80 border border-red-500/50 rounded-xl p-4 relative animate-pulse-slow">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-red-400/60 hover:text-red-300 text-lg leading-none"
        aria-label="Dismiss alerts"
      >
        ×
      </button>

      <div className="flex items-start gap-3">
        <div className="text-red-400 text-xl shrink-0 mt-0.5">⚠️</div>
        <div className="flex-1 min-w-0">
          <div className="text-red-300 font-display font-bold text-sm mb-1">
            Earthquake Alert {alerts.length > 1 ? `(${current + 1}/${alerts.length})` : ''}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            <span className="text-red-400/70">Magnitude</span>
            <span className="text-red-300 font-bold">M {alert.magnitude.toFixed(1)}</span>
            <span className="text-red-400/70">Distance</span>
            <span className="text-red-300 font-semibold">{alert.distanceToBangladesh} km</span>
            <span className="text-red-400/70">Depth</span>
            <span className="text-red-300">{alert.depth} km</span>
          </div>
          <div className="text-xs text-red-400/70 mt-1.5 truncate">{alert.place}</div>
        </div>
      </div>

      {alerts.length > 1 && (
        <div className="flex gap-1 mt-3 justify-center">
          {alerts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-red-400' : 'bg-red-800'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

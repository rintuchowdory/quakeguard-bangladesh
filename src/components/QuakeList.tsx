'use client';

import { Earthquake } from '@/types';
import { getMagnitudeColor, formatTimeAgo } from '@/utils/earthquake';

interface QuakeListProps {
  quakes: Earthquake[];
  loading: boolean;
  onSelect?: (q: Earthquake) => void;
}

export default function QuakeList({ quakes, loading, onSelect }: QuakeListProps) {
  const top = quakes.slice(0, 8);

  return (
    <div className="bg-navy-700/40 border border-slate-700/40 rounded-xl p-4">
      <div className="text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Recent Events
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-800/50 rounded animate-pulse" />
            ))
          : top.map((q) => {
              const color = getMagnitudeColor(q.magnitude);
              const isAlert = q.magnitude >= 5.5 && (q.distanceToBangladesh ?? Infinity) <= 1000;
              return (
                <button
                  key={q.id}
                  onClick={() => onSelect?.(q)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-left"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-xs shrink-0"
                    style={{ background: color + '22', color }}
                  >
                    {q.magnitude.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 truncate">{q.place}</div>
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span>{formatTimeAgo(q.time)}</span>
                      <span>·</span>
                      <span>{q.distanceToBangladesh} km</span>
                    </div>
                  </div>
                  {isAlert && (
                    <span className="text-red-400 text-xs shrink-0">⚠️</span>
                  )}
                </button>
              );
            })}
        {!loading && quakes.length === 0 && (
          <div className="text-center text-slate-600 text-sm py-6">No earthquakes detected</div>
        )}
      </div>
    </div>
  );
}

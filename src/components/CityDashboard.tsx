'use client';

import { Earthquake } from '@/types';
import { BANGLADESH_CITIES, distanceKm } from '@/utils/earthquake';

interface CityDashboardProps {
  quakes: Earthquake[];
  loading: boolean;
}

function getCityRisk(distToNearest: number | null, mag: number | null): { label: string; color: string } {
  if (!distToNearest || !mag) return { label: 'Safe', color: '#10B981' };
  if (distToNearest < 300 && mag >= 6) return { label: 'High', color: '#EF4444' };
  if (distToNearest < 500 && mag >= 5) return { label: 'Medium', color: '#F59E0B' };
  if (distToNearest < 800 && mag >= 4) return { label: 'Low', color: '#3B82F6' };
  return { label: 'Safe', color: '#10B981' };
}

export default function CityDashboard({ quakes, loading }: CityDashboardProps) {
  const cityData = BANGLADESH_CITIES.map((city) => {
    const distances = quakes.map((q) => ({
      q,
      d: distanceKm(city.lat, city.lng, q.lat, q.lng),
    })).sort((a, b) => a.d - b.d);

    const nearest = distances[0];
    const risk = getCityRisk(nearest?.d ?? null, nearest?.q.magnitude ?? null);

    return { ...city, nearest, risk };
  });

  return (
    <div className="bg-navy-700/40 border border-slate-700/40 rounded-xl p-4">
      <div className="text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-3">
        City Risk Assessment
      </div>
      <div className="space-y-2">
        {cityData.map((city) => (
          <div key={city.name} className="flex items-center gap-3">
            <div className="w-20 text-sm font-display font-semibold text-slate-300 shrink-0">
              {city.name}
            </div>
            <div className="flex-1 bg-slate-800 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{
                  width: loading ? '0%' : `${Math.max(10, 100 - (city.nearest?.d ?? 1000) / 10)}%`,
                  background: city.risk.color,
                }}
              />
            </div>
            <div className="w-14 text-right">
              <span className="text-xs font-semibold" style={{ color: city.risk.color }}>
                {loading ? '...' : city.risk.label}
              </span>
            </div>
            {city.nearest && !loading && (
              <div className="w-16 text-xs text-slate-600 text-right shrink-0">
                {city.nearest.d} km
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-600">Distance to nearest M3.5+ quake</div>
    </div>
  );
}

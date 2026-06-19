'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEarthquakes } from '@/hooks/useEarthquakes';
import { Earthquake } from '@/types';
import RiskPanel from '@/components/RiskPanel';
import AlertBanner from '@/components/AlertBanner';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';
import CityDashboard from '@/components/CityDashboard';
import QuakeList from '@/components/QuakeList';

// Dynamic import for map (no SSR)
const EarthquakeMap = dynamic(() => import('@/components/EarthquakeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-navy-800 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <div className="text-sm text-slate-500">Loading map…</div>
      </div>
    </div>
  ),
});

const TIME_RANGES = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '1y', label: '1 Year' },
] as const;

export default function Home() {
  const { quakes, stats, risk, loading, error, lastUpdated, timeRange, setTimeRange, refresh } = useEarthquakes();
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="seismic-logo text-2xl">📡</div>
          <div>
            <h1 className="font-display font-bold text-white text-base leading-tight tracking-tight">
              QuakeGuard Bangladesh
            </h1>
            <p className="text-xs text-slate-500">Live Seismic Risk Monitor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex bg-[#141C2E] border border-slate-700/40 rounded-lg p-0.5 gap-0.5">
            {TIME_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setTimeRange(r.value)}
                className={`px-3 py-1.5 rounded text-xs font-display font-semibold transition-all ${
                  timeRange === r.value
                    ? 'bg-amber-500 text-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Refresh + status */}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1E2D4A] hover:bg-[#253558] border border-slate-700/40 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span>
            <span className="hidden sm:inline">
              {loading ? 'Updating…' : lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}` : 'Refresh'}
            </span>
          </button>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-400 font-display font-semibold hidden sm:inline">LIVE</span>
          </div>
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-red-950/60 border border-red-500/40 rounded-lg text-sm text-red-300">
          ⚠️ {error} — USGS data may be temporarily unavailable.
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map — left 60% */}
        <div className="flex-1 p-3 min-h-0">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700/30">
            <EarthquakeMap quakes={quakes} onQuakeClick={setSelectedQuake} />

            {/* Map legend */}
            <div className="absolute bottom-10 left-3 bg-[#0A0E1A]/90 border border-slate-700/40 rounded-lg px-3 py-2 text-xs space-y-1 backdrop-blur">
              <div className="text-slate-500 font-display font-semibold uppercase text-[10px] tracking-wider mb-1.5">Magnitude</div>
              {[
                { label: '6.0+', color: '#EF4444' },
                { label: '5.0–6.0', color: '#F97316' },
                { label: '4.0–5.0', color: '#F59E0B' },
                { label: '3.5–4.0', color: '#10B981' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-slate-400">{l.label}</span>
                </div>
              ))}
              <div className="pt-1 mt-1 border-t border-slate-700/40 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border border-amber-500 bg-transparent" />
                <span className="text-slate-400">BD Cities</span>
              </div>
            </div>

            {/* Selected quake overlay */}
            {selectedQuake && (
              <div className="absolute top-3 left-3 bg-[#0F1625]/95 border border-amber-500/30 rounded-xl p-4 backdrop-blur max-w-xs">
                <button
                  onClick={() => setSelectedQuake(null)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 text-lg leading-none"
                >×</button>
                <div className="font-display font-bold text-amber-400 text-xl mb-1">
                  M {selectedQuake.magnitude.toFixed(1)}
                </div>
                <div className="text-sm text-slate-300 mb-2">{selectedQuake.place}</div>
                <div className="space-y-1 text-xs text-slate-500">
                  <div>📅 {new Date(selectedQuake.time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' })}</div>
                  <div>📍 Depth: {selectedQuake.depth} km</div>
                  <div>📏 {selectedQuake.distanceToBangladesh} km from Bangladesh</div>
                  <div>🌐 {selectedQuake.lat.toFixed(3)}°N, {selectedQuake.lng.toFixed(3)}°E</div>
                </div>
                <a
                  href={selectedQuake.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs text-amber-500 hover:text-amber-400 underline"
                >
                  View on USGS ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — right panel */}
        <div className="w-80 shrink-0 flex flex-col gap-3 p-3 pl-0 overflow-y-auto scrollbar-thin">
          {/* Alerts */}
          {stats.alerts.length > 0 && (
            <AlertBanner alerts={stats.alerts} />
          )}

          {/* Risk panel */}
          <RiskPanel risk={risk} loading={loading} />

          {/* Stats cards */}
          <StatsCards stats={stats} loading={loading} />

          {/* Charts */}
          <Charts quakes={quakes} loading={loading} />

          {/* City dashboard */}
          <CityDashboard quakes={quakes} loading={loading} />

          {/* Recent quakes */}
          <QuakeList quakes={stats.nearBangladesh.length ? stats.nearBangladesh : quakes} loading={loading} onSelect={setSelectedQuake} />

          {/* Footer */}
          <div className="text-center text-xs text-slate-700 pb-2">
            <div>Data: USGS Earthquake Hazards Program</div>
            <div>Updates every 5 minutes · M3.5+ events</div>
            <div className="mt-1 text-slate-800">Built by Rintu · QuakeGuard BD 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

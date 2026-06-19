'use client';

import { StatsData } from '@/types';
import { formatTimeAgo } from '@/utils/earthquake';

interface StatsCardsProps {
  stats: StatsData;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      label: 'Quakes Today',
      value: loading ? '—' : stats.total.toString(),
      sub: 'M3.5+ in region',
      icon: '🌏',
      accent: '#3B82F6',
    },
    {
      label: 'Strongest',
      value: loading ? '—' : stats.strongest ? `M ${stats.strongest.magnitude.toFixed(1)}` : 'None',
      sub: loading || !stats.strongest ? 'No data' : stats.strongest.place.split(',').pop()?.trim() ?? '',
      icon: '💥',
      accent: '#EF4444',
    },
    {
      label: 'Avg Magnitude',
      value: loading ? '—' : stats.avgMagnitude.toFixed(1),
      sub: 'All detected quakes',
      icon: '📊',
      accent: '#F59E0B',
    },
    {
      label: 'Near Bangladesh',
      value: loading ? '—' : stats.nearBangladesh.length.toString(),
      sub: 'Within 1000 km',
      icon: '📍',
      accent: '#10B981',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-navy-700/60 border border-slate-700/40 rounded-xl p-4 relative overflow-hidden"
        >
          <div
            className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-10"
            style={{ background: card.accent }}
          />
          <div className="text-base mb-1">{card.icon}</div>
          <div className="font-display font-bold text-xl text-white">{card.value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
          <div className="text-xs mt-1 truncate" style={{ color: card.accent + 'aa' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}

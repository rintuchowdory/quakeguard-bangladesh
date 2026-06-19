'use client';

import { useEffect, useRef } from 'react';
import { Earthquake } from '@/types';

interface ChartsProps {
  quakes: Earthquake[];
  loading: boolean;
}

export default function Charts({ quakes, loading }: ChartsProps) {
  const distRef = useRef<HTMLCanvasElement>(null);
  const trendRef = useRef<HTMLCanvasElement>(null);
  const distChart = useRef<any>(null);
  const trendChart = useRef<any>(null);

  useEffect(() => {
    if (loading || !quakes.length) return;
    if (typeof window === 'undefined') return;

    import('chart.js').then((ChartModule) => {
      const { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } = ChartModule;
      Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

      // Magnitude distribution
      const bins = ['3.5-4', '4-4.5', '4.5-5', '5-5.5', '5.5-6', '6+'];
      const counts = [0, 0, 0, 0, 0, 0];
      quakes.forEach((q) => {
        if (q.magnitude < 4) counts[0]++;
        else if (q.magnitude < 4.5) counts[1]++;
        else if (q.magnitude < 5) counts[2]++;
        else if (q.magnitude < 5.5) counts[3]++;
        else if (q.magnitude < 6) counts[4]++;
        else counts[5]++;
      });

      if (distRef.current) {
        if (distChart.current) distChart.current.destroy();
        distChart.current = new Chart(distRef.current, {
          type: 'bar',
          data: {
            labels: bins,
            datasets: [{
              label: 'Count',
              data: counts,
              backgroundColor: ['#10B981', '#10B981', '#F59E0B', '#F59E0B', '#F97316', '#EF4444'],
              borderRadius: 4,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: '#1E2D4A' }, ticks: { color: '#64748b', font: { size: 10 } } },
              y: { grid: { color: '#1E2D4A' }, ticks: { color: '#64748b', font: { size: 10 } } },
            },
          },
        });
      }

      // Daily trend (last 7 days)
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        days[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
      }
      quakes.forEach((q) => {
        const d = new Date(q.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (days[d] !== undefined) days[d]++;
      });

      if (trendRef.current) {
        if (trendChart.current) trendChart.current.destroy();
        trendChart.current = new Chart(trendRef.current, {
          type: 'line',
          data: {
            labels: Object.keys(days),
            datasets: [{
              label: 'Quakes',
              data: Object.values(days),
              borderColor: '#F59E0B',
              backgroundColor: 'rgba(245,158,11,0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#F59E0B',
              pointRadius: 3,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: '#1E2D4A' }, ticks: { color: '#64748b', font: { size: 10 } } },
              y: { grid: { color: '#1E2D4A' }, ticks: { color: '#64748b', font: { size: 10 } } },
            },
          },
        });
      }
    });

    return () => {
      distChart.current?.destroy();
      trendChart.current?.destroy();
    };
  }, [quakes, loading]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-navy-700/40 border border-slate-700/40 rounded-xl p-4">
        <div className="text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Magnitude Distribution
        </div>
        <div className="h-28">
          {loading ? <div className="h-full bg-slate-800/50 rounded animate-pulse" /> : <canvas ref={distRef} />}
        </div>
      </div>
      <div className="bg-navy-700/40 border border-slate-700/40 rounded-xl p-4">
        <div className="text-xs font-display font-semibold text-slate-400 uppercase tracking-widest mb-3">
          7-Day Trend
        </div>
        <div className="h-28">
          {loading ? <div className="h-full bg-slate-800/50 rounded animate-pulse" /> : <canvas ref={trendRef} />}
        </div>
      </div>
    </div>
  );
}

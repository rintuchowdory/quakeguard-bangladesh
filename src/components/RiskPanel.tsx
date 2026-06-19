'use client';

import { RiskAssessment } from '@/types';
import { getRiskColor } from '@/utils/earthquake';

interface RiskPanelProps {
  risk: RiskAssessment;
  loading: boolean;
}

const RISK_CONFIG = {
  low: { emoji: '🟢', label: 'Low Risk', bg: 'bg-emerald-950/50', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  medium: { emoji: '🟡', label: 'Medium Risk', bg: 'bg-amber-950/50', border: 'border-amber-500/30', text: 'text-amber-400' },
  high: { emoji: '🔴', label: 'High Risk', bg: 'bg-orange-950/50', border: 'border-orange-500/30', text: 'text-orange-400' },
  critical: { emoji: '🚨', label: 'Critical Risk', bg: 'bg-red-950/50', border: 'border-red-500/30', text: 'text-red-400' },
};

export default function RiskPanel({ risk, loading }: RiskPanelProps) {
  const config = RISK_CONFIG[risk.level];
  const color = getRiskColor(risk.level);

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5 relative overflow-hidden`}>
      {/* Pulsing background glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-10 animate-pulse-slow"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-display font-semibold text-slate-400 uppercase tracking-widest">
            Bangladesh Risk Status
          </span>
          <span className="text-xs text-slate-500">Live</span>
        </div>

        {loading ? (
          <div className="h-12 bg-slate-800/50 rounded animate-pulse" />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{config.emoji}</span>
              <div>
                <div className={`text-2xl font-display font-bold ${config.text}`}>
                  {config.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Risk Score: {risk.score}/100
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(risk.score, 100)}%`, background: color }}
              />
            </div>

            {/* Reasons */}
            <div className="space-y-1.5">
              {risk.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="mt-0.5 shrink-0" style={{ color }}>›</span>
                  {r}
                </div>
              ))}
              {risk.reasons.length === 0 && (
                <div className="text-xs text-slate-500">No significant seismic threats detected.</div>
              )}
            </div>

            {/* Closest quake */}
            {risk.closestQuake && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Closest significant quake</div>
                <div className="text-sm font-display font-semibold text-slate-300">
                  M{risk.closestQuake.magnitude.toFixed(1)} · {risk.closestQuake.distanceToBangladesh} km away
                </div>
                <div className="text-xs text-slate-500 truncate">{risk.closestQuake.place}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

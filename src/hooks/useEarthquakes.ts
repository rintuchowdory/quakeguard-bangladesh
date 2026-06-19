'use client';

import { useState, useEffect, useCallback } from 'react';
import { Earthquake, StatsData, TimeRange } from '@/types';
import { distanceKm, BANGLADESH_CENTER, calcRisk, getUSGSUrl } from '@/utils/earthquake';
import { RiskAssessment } from '@/types';

interface UseEarthquakesReturn {
  quakes: Earthquake[];
  stats: StatsData;
  risk: RiskAssessment;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  timeRange: TimeRange;
  setTimeRange: (r: TimeRange) => void;
  refresh: () => void;
}

const emptyStats: StatsData = {
  total: 0,
  strongest: null,
  avgMagnitude: 0,
  nearBangladesh: [],
  alerts: [],
};

export function useEarthquakes(): UseEarthquakesReturn {
  const [quakes, setQuakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState<StatsData>(emptyStats);
  const [risk, setRisk] = useState<RiskAssessment>({ level: 'low', score: 0, reasons: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = getUSGSUrl(timeRange);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch seismic data');
      const json = await res.json();

      const parsed: Earthquake[] = json.features.map((f: any) => {
        const dist = distanceKm(
          f.geometry.coordinates[1],
          f.geometry.coordinates[0],
          BANGLADESH_CENTER.lat,
          BANGLADESH_CENTER.lng
        );
        return {
          id: f.id,
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          depth: f.geometry.coordinates[2],
          url: f.properties.url,
          distanceToBangladesh: dist,
        };
      });

      // Sort by time desc
      parsed.sort((a, b) => b.time - a.time);

      const nearBD = parsed.filter((q) => (q.distanceToBangladesh ?? Infinity) <= 1000);
      const alerts = parsed.filter(
        (q) => q.magnitude >= 5.5 && (q.distanceToBangladesh ?? Infinity) <= 1000
      );
      const strongest = parsed.length
        ? parsed.reduce((a, b) => (a.magnitude > b.magnitude ? a : b))
        : null;
      const avgMag = parsed.length
        ? Math.round((parsed.reduce((s, q) => s + q.magnitude, 0) / parsed.length) * 10) / 10
        : 0;

      setQuakes(parsed);
      setStats({ total: parsed.length, strongest, avgMagnitude: avgMag, nearBangladesh: nearBD, alerts });
      setRisk(calcRisk(parsed));
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, [fetchData]);

  return { quakes, stats, risk, loading, error, lastUpdated, timeRange, setTimeRange, refresh: fetchData };
}

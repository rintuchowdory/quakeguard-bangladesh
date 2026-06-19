export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depth: number;
  url: string;
  distanceToBangladesh?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface BangladeshCity {
  name: string;
  lat: number;
  lng: number;
  population: string;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  reasons: string[];
  closestQuake?: Earthquake;
}

export interface StatsData {
  total: number;
  strongest: Earthquake | null;
  avgMagnitude: number;
  nearBangladesh: Earthquake[];
  alerts: Earthquake[];
}

export type TimeRange = '24h' | '7d' | '30d' | '1y';

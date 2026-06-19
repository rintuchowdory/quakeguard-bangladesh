import { Earthquake, BangladeshCity, RiskAssessment, TimeRange } from '@/types';

// Bangladesh center coordinates
export const BANGLADESH_CENTER = { lat: 23.6850, lng: 90.3563 };

export const BANGLADESH_CITIES: BangladeshCity[] = [
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125, population: '22M' },
  { name: 'Chittagong', lat: 22.3569, lng: 91.7832, population: '8M' },
  { name: 'Sylhet', lat: 24.8949, lng: 91.8687, population: '3.5M' },
  { name: 'Rajshahi', lat: 24.3745, lng: 88.6042, population: '1M' },
  { name: 'Khulna', lat: 22.8456, lng: 89.5403, population: '1.5M' },
];

export const RISK_RADIUS_KM = 1000;

// Haversine formula
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function calcRisk(quakes: Earthquake[]): RiskAssessment {
  const nearby = quakes.filter((q) => (q.distanceToBangladesh ?? Infinity) <= RISK_RADIUS_KM);

  if (nearby.length === 0) {
    return { level: 'low', score: 0, reasons: ['No significant seismic activity within 1000 km'], closestQuake: undefined };
  }

  let score = 0;
  const reasons: string[] = [];
  const strongest = nearby.reduce((a, b) => (a.magnitude > b.magnitude ? a : b));

  // Magnitude factor
  if (strongest.magnitude >= 7.0) { score += 40; reasons.push(`Major M${strongest.magnitude} quake detected`); }
  else if (strongest.magnitude >= 6.0) { score += 25; reasons.push(`Strong M${strongest.magnitude} quake detected`); }
  else if (strongest.magnitude >= 5.0) { score += 15; reasons.push(`Moderate M${strongest.magnitude} quake detected`); }
  else { score += 5; }

  // Distance factor
  const minDist = Math.min(...nearby.map((q) => q.distanceToBangladesh ?? Infinity));
  if (minDist < 200) { score += 35; reasons.push(`Quake only ${minDist} km away`); }
  else if (minDist < 400) { score += 25; reasons.push(`Quake ${minDist} km away`); }
  else if (minDist < 700) { score += 15; reasons.push(`Quake ${minDist} km away`); }
  else { score += 5; }

  // Depth factor (shallow = more dangerous)
  if (strongest.depth < 30) { score += 15; reasons.push(`Shallow depth (${strongest.depth} km)`); }
  else if (strongest.depth < 70) { score += 8; }

  // Frequency factor
  if (nearby.length > 5) { score += 10; reasons.push(`${nearby.length} quakes in region`); }

  let level: RiskAssessment['level'] = 'low';
  if (score >= 70) level = 'critical';
  else if (score >= 45) level = 'high';
  else if (score >= 20) level = 'medium';

  return { level, score, reasons, closestQuake: strongest };
}

export function getUSGSUrl(range: TimeRange): string {
  const base = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3.5';
  const now = Date.now();
  const bounds = `&minlatitude=15&maxlatitude=35&minlongitude=75&maxlongitude=110`;

  switch (range) {
    case '24h': return `${base}&starttime=${new Date(now - 86400000).toISOString()}${bounds}`;
    case '7d': return `${base}&starttime=${new Date(now - 7 * 86400000).toISOString()}${bounds}`;
    case '30d': return `${base}&starttime=${new Date(now - 30 * 86400000).toISOString()}${bounds}`;
    case '1y': return `${base}&starttime=${new Date(now - 365 * 86400000).toISOString()}${bounds}`;
  }
}

export function getMagnitudeColor(mag: number): string {
  if (mag >= 7) return '#EF4444';
  if (mag >= 6) return '#F97316';
  if (mag >= 5) return '#F59E0B';
  if (mag >= 4) return '#EAB308';
  return '#10B981';
}

export function getRiskColor(level: string): string {
  switch (level) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#F59E0B';
    default: return '#10B981';
  }
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

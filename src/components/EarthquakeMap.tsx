'use client';

import { useEffect, useRef } from 'react';
import { Earthquake } from '@/types';
import { getMagnitudeColor, BANGLADESH_CITIES, BANGLADESH_CENTER } from '@/utils/earthquake';

interface MapProps {
  quakes: Earthquake[];
  onQuakeClick?: (q: Earthquake) => void;
}

export default function EarthquakeMap({ quakes, onQuakeClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Fix default icon issue with webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);
      map.attributionControl?.addAttribution('Data: USGS | Map: CARTO');

      // Risk radius circle
      L.circle([BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng], {
        radius: 1000000,
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.03,
        weight: 1,
        dashArray: '6 6',
      }).addTo(map).bindPopup('<b>1000 km Risk Zone</b><br>Bangladesh monitoring radius');

      // City markers
      BANGLADESH_CITIES.forEach((city) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:#1E2D4A;border:2px solid #F59E0B;border-radius:50%;width:10px;height:10px;"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([city.lat, city.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>🏙️ ${city.name}</b><br>Population: ${city.population}`);
      });

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when quakes change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import('leaflet').then((L) => {
      markersLayerRef.current.clearLayers();

      quakes.forEach((q) => {
        const color = getMagnitudeColor(q.magnitude);
        const size = Math.max(8, q.magnitude * 5);
        const isAlert = q.magnitude >= 5.5 && (q.distanceToBangladesh ?? Infinity) <= 1000;

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:${size}px;height:${size}px;">
              ${isAlert ? `<div style="position:absolute;inset:-4px;border-radius:50%;background:${color};opacity:0.3;animation:ping 1.5s ease-in-out infinite;"></div>` : ''}
              <div style="
                width:${size}px;height:${size}px;
                background:${color};
                border-radius:50%;
                border:2px solid rgba(255,255,255,0.6);
                box-shadow:0 0 ${isAlert ? 12 : 6}px ${color};
                cursor:pointer;
              "></div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const timeStr = new Date(q.time).toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

        L.marker([q.lat, q.lng], { icon })
          .addTo(markersLayerRef.current)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px;">
              <div style="font-weight:700;font-size:16px;color:${color}">M ${q.magnitude.toFixed(1)}</div>
              <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${q.place}</div>
              <div style="font-size:11px;color:#64748b;">🕐 ${timeStr} (BD)</div>
              <div style="font-size:11px;color:#64748b;">📍 Depth: ${q.depth} km</div>
              <div style="font-size:11px;color:#64748b;">📏 ${q.distanceToBangladesh} km from Bangladesh</div>
              ${isAlert ? `<div style="margin-top:6px;padding:4px 8px;background:#EF444420;border:1px solid #EF4444;border-radius:4px;font-size:11px;color:#EF4444;font-weight:600;">⚠️ Alert Zone</div>` : ''}
            </div>
          `)
          .on('click', () => onQuakeClick?.(q));
      });
    });
  }, [quakes, onQuakeClick]);

  return (
    <div className="relative w-full h-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          background: #0F1625 !important;
          border: 1px solid #1E2D4A !important;
          border-radius: 8px !important;
          color: #e2e8f0 !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-tip { background: #0F1625 !important; }
        .leaflet-popup-close-button { color: #94a3b8 !important; }
        .leaflet-control-zoom a {
          background: #1E2D4A !important;
          color: #F59E0B !important;
          border-color: #253558 !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,14,26,0.8) !important;
          color: #475569 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #64748b !important; }
      `}</style>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
}

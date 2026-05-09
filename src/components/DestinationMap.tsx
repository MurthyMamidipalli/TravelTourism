
'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DestinationMapProps {
  name: string;
  lat: number;
  lng: number;
}

export default function DestinationMap({ name, lat, lng }: DestinationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Fix Leaflet's default marker icon issue in Next.js
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], 14);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      // Add marker
      L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-bold text-sm mb-1">${name}</h4>
            <p class="text-xs text-muted-foreground">Tourist Destination</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" class="text-[10px] text-primary font-bold hover:underline block mt-2">Get Directions</a>
          </div>
        `)
        .openPopup();

      setLoading(false);
    } else {
      // Update view if props change
      mapInstanceRef.current.setView([lat, lng], 14);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <Card className="relative w-full h-[400px] rounded-3xl overflow-hidden border-none shadow-lg bg-secondary/10">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-[1000]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Initializing OpenStreetMap...</p>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-0" />
    </Card>
  );
}

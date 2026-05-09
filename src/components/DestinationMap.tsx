
'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';

interface DestinationMapProps {
  name: string;
  lat: number;
  lng: number;
}

export default function DestinationMap({ name, lat, lng }: DestinationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    
    if (!apiKey) {
      setLoading(false);
      setApiError(true);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    loader.load().then(async () => {
      if (!mapRef.current) return;

      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

      const position = { lat, lng };
      const map = new Map(mapRef.current, {
        center: position,
        zoom: 14,
        mapId: 'DEMO_MAP_ID', // Replace with your Map ID for advanced markers
        disableDefaultUI: false,
        zoomControl: true,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry.fill",
            "stylers": [{ "weight": "2.00" }]
          },
          {
            "featureType": "all",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#9c9c9c" }]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{ "saturation": -100 }, { "lightness": 45 }]
          }
        ]
      });

      new AdvancedMarkerElement({
        map,
        position,
        title: name,
      });

      setLoading(false);
    }).catch((e) => {
      console.error("Google Maps failed to load", e);
      setLoading(false);
      setApiError(true);
    });
  }, [lat, lng, name]);

  return (
    <Card className="relative w-full h-[400px] rounded-3xl overflow-hidden border-none shadow-lg bg-secondary/10">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Loading Location Map...</p>
        </div>
      )}
      
      {apiError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">Interactive Map Preview</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Maps are ready for {name}. Please configure your NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live tracking.
            </p>
          </div>
          <div className="text-[10px] font-mono bg-secondary px-3 py-1 rounded text-muted-foreground">
            Coordinates: {lat}, {lng}
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </Card>
  );
}

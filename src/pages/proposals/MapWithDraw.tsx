import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Button from '@/components/ui/button'; // Ensure this import is correct based on your project structure

interface MapWithDrawProps {
  onGeojsonChange: (geojson: string) => void;
  onSave: () => void;
}

const MapWithDraw: React.FC<MapWithDrawProps> = ({ onGeojsonChange, onSave }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const positionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([0, 0], 2);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const drawnItems = drawnItemsRef.current;
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polygon: {},
        },
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        const geojson = drawnItems.toGeoJSON();
        onGeojsonChange(JSON.stringify(geojson));
      });

      map.on(L.Draw.Event.EDITED, () => {
        const geojson = drawnItems.toGeoJSON();
        onGeojsonChange(JSON.stringify(geojson));
      });

      map.on(L.Draw.Event.DELETED, () => {
        const geojson = drawnItems.toGeoJSON();
        onGeojsonChange(JSON.stringify(geojson));
      });

      setIsMapInitialized(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onGeojsonChange]);

  useEffect(() => {
    if (isMapInitialized && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          positionRef.current = { latitude, longitude };
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 13);
          }
        },
        () => {
          console.error('Unable to retrieve location.');
        }
      );
    }
  }, [isMapInitialized]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
      <Button shape="rounded" onClick={onSave} className="bg-button-green mt-4">
        Save
      </Button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapWithDraw), { ssr: false });

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/button'; // Assurez-vous que ce chemin est correct

// Import dynamique du composant LeafletMap avec désactivation du rendu côté serveur
const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

interface MapWithDrawProps {
  onGeojsonChange: (geojson: string) => void;
  onSave: () => void;
}

const MapWithDraw: React.FC<MapWithDrawProps> = ({ onGeojsonChange, onSave }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Ce useEffect s'assure que mapLoaded est vrai après le premier rendu
    setMapLoaded(true);
  }, []);

  return (
    <div>
      {mapLoaded && <DynamicLeafletMap onGeojsonChange={onGeojsonChange} />}
      <Button shape="rounded" onClick={onSave} className="bg-button-green mt-4">
        Sauvegarder
      </Button>
    </div>
  );
};

export default MapWithDraw;

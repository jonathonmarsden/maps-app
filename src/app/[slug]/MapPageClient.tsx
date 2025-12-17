"use client";
import * as React from 'react';
import MapView from '@/components/MapView';
import MethodologyPanel from '@/components/MethodologyPanel';
import type { MapDefinition } from '@/data/registry';

export default function MapPageClient({ mapData }: { mapData: MapDefinition }) {
  const [showMethodology, setShowMethodology] = React.useState(false);

  return (
    <div className="relative w-full h-screen">
      <MethodologyPanel 
        title={mapData.title}
        description={mapData.description}
        methodology={mapData.methodology}
        isOpen={showMethodology}
        onClose={() => setShowMethodology(false)}
      />

      <MapView 
        initialViewState={mapData.initialViewState} 
        geoJsonData={mapData.geoJsonData}
        enable3d={mapData.enable3d}
        title={mapData.title}
        description={mapData.description}
        sources={mapData.sources}
        methodology={mapData.methodology}
        onMethodologyOpen={() => setShowMethodology(true)}
      />
    </div>
  );
}

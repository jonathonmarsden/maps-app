"use client";
import * as React from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// You will need to add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapViewProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  geoJsonData?: any;
  enable3d?: boolean;
  title?: string;
}

export default function MapView({ initialViewState, geoJsonData, enable3d, title }: MapViewProps) {
  const defaultViewState = {
    longitude: 144.9631, // Melbourne
    latitude: -37.8136,
    zoom: 10
  };

  return (
    <div className="w-full h-screen">
      <Map
        initialViewState={initialViewState || defaultViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        terrain={enable3d ? { source: 'mapbox-dem', exaggeration: 1.5 } : undefined}
      >
        <NavigationControl position="top-right" />
        <ScaleControl />

        {enable3d && (
          <>
            <Source
              id="mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />
            <Layer
              id="3d-buildings"
              source="composite"
              source-layer="building"
              filter={['==', 'extrude', 'true']}
              type="fill-extrusion"
              minzoom={14}
              paint={{
                'fill-extrusion-color': '#222',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.8
              }}
            />
          </>
        )}

        {geoJsonData && (
          <Source id="main-data" type="geojson" data={geoJsonData}>
            <Layer
              id="data-fill"
              type="fill"
              filter={['==', '$type', 'Polygon']}
              paint={{
                'fill-color': '#3b82f6', // Blue-500
                'fill-opacity': 0.2,
                'fill-outline-color': '#60a5fa'
              }}
            />
            <Layer
              id="data-line"
              type="line"
              filter={['==', '$type', 'LineString']}
              paint={{
                'line-color': '#00ff9d', // Neon Green
                'line-width': 3,
                'line-blur': 1,
                'line-opacity': 0.8
              }}
            />
            <Layer
              id="data-line-core"
              type="line"
              filter={['==', '$type', 'LineString']}
              paint={{
                'line-color': '#ffffff',
                'line-width': 1,
                'line-opacity': 1
              }}
            />
            <Layer
              id="data-circle"
              type="circle"
              filter={['==', '$type', 'Point']}
              paint={{
                'circle-radius': 6,
                'circle-color': '#00ff9d',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

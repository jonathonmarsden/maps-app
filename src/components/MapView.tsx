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
    pitch?: number;
    bearing?: number;
  };
  geoJsonData?: any;
  enable3d?: boolean;
  title?: string;
  sources?: {
    id: string;
    label?: string;
    color?: string;
    legendItems?: { label: string; color: string }[]; // Support for multi-class legends
    type: 'geojson';
    data: string | any;
    layers: any[];
  }[];
  methodology?: string; // Markdown or text for the methodology modal
}

export default function MapView({ initialViewState, geoJsonData, enable3d, title, sources, methodology }: MapViewProps) {
  const defaultViewState = {
    longitude: 144.9631, // Melbourne
    latitude: -37.8136,
    zoom: 10
  };

  // State to track visibility of each source
  const [visibility, setVisibility] = React.useState<Record<string, boolean>>({});
  const [showMethodology, setShowMethodology] = React.useState(false);

  // Initialize visibility when sources change
  React.useEffect(() => {
    if (sources) {
      const initialVisibility: Record<string, boolean> = {};
      sources.forEach(s => {
        initialVisibility[s.id] = true;
      });
      setVisibility(initialVisibility);
    }
  }, [sources]);

  const toggleVisibility = (id: string) => {
    setVisibility(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="w-full h-screen relative">
      {/* Methodology Button */}
      {methodology && (
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => setShowMethodology(true)}
            className="bg-white/90 hover:bg-white text-black px-4 py-2 rounded shadow-md font-semibold text-sm backdrop-blur-sm transition-colors"
          >
            Methodology
          </button>
        </div>
      )}

      {/* Methodology Modal */}
      {showMethodology && methodology && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white text-black p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Methodology</h2>
            <div className="prose prose-sm">
              <p className="whitespace-pre-wrap">{methodology}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend / Key */}
      {sources && sources.length > 0 && (
        <div className="absolute bottom-8 right-4 z-10 bg-white/90 text-black p-4 rounded-lg backdrop-blur-sm border border-neutral-200 shadow-xl min-w-[240px]">
          <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-neutral-600">Map Layers</h3>
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id}>
                <div 
                  className="flex items-center justify-between cursor-pointer hover:bg-black/5 p-1 rounded transition-colors"
                  onClick={() => toggleVisibility(source.id)}
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span className={`text-sm ${!visibility[source.id] ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                      {source.label || source.id}
                    </span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${visibility[source.id] ? 'bg-blue-600' : 'bg-neutral-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${visibility[source.id] ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </div>
                
                {/* Sub-legend items (only if visible) */}
                {visibility[source.id] && source.legendItems && (
                  <div className="ml-2 mt-1 space-y-1 border-l-2 border-neutral-200 pl-2">
                    {source.legendItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-sm shadow-sm" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-neutral-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Map
        initialViewState={initialViewState || defaultViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
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

        {/* Render Custom Sources */}
        {sources?.map((source) => (
          <Source key={source.id} id={source.id} type={source.type} data={source.data}>
            {source.layers.map((layer) => (
              <Layer 
                key={layer.id} 
                {...layer} 
                layout={{
                  ...layer.layout,
                  visibility: visibility[source.id] ? 'visible' : 'none'
                }}
              />
            ))}
          </Source>
        ))}

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

"use client";
import * as React from 'react';
import Map, { Source, Layer, NavigationControl, ScaleControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMarkdown from 'react-markdown';

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
  onMethodologyOpen?: () => void; // Callback when methodology should be shown
}

export default function MapView({ initialViewState, geoJsonData, enable3d, title, sources, methodology, onMethodologyOpen }: MapViewProps) {
  const defaultViewState = {
    longitude: 144.9631, // Melbourne
    latitude: -37.8136,
    zoom: 10
  };

  // State to track visibility of each source
  const [visibility, setVisibility] = React.useState<Record<string, boolean>>({});
  const [rankVisibility, setRankVisibility] = React.useState<Record<number, boolean>>({});
  const [minAreaHa, setMinAreaHa] = React.useState<number>(4); // Default to 4 ha for public view
  const [candidateFeatures, setCandidateFeatures] = React.useState<any[]>([]);
  const [candidateCount, setCandidateCount] = React.useState<number>(0);
  const [showAccessZones, setShowAccessZones] = React.useState<boolean>(false);

  // Initialize visibility when sources change
  React.useEffect(() => {
    if (sources) {
      const initialVisibility: Record<string, boolean> = {};
      sources.forEach(s => {
        initialVisibility[s.id] = true;
      });
      setVisibility(initialVisibility);
      // Initialize rank visibility (all ranks visible by default)
      const initialRankVisibility: Record<number, boolean> = {};
      for (let i = 1; i <= 5; i++) {
        initialRankVisibility[i] = true;
      }
      setRankVisibility(initialRankVisibility);
    }
  }, [sources]);

  // Load candidates GeoJSON features for client-side counting
  React.useEffect(() => {
    if (!sources) return;
    const candidates = sources.find(s => s.id === 'candidates');
    if (!candidates) return;
    if (typeof candidates.data === 'string') {
      fetch(candidates.data)
        .then(res => res.json())
        .then(json => {
          const feats = Array.isArray(json.features) ? json.features : [];
          setCandidateFeatures(feats);
        })
        .catch(() => setCandidateFeatures([]));
    }
  }, [sources]);

  // Recompute filtered candidate count when filters change
  React.useEffect(() => {
    if (!candidateFeatures.length) { setCandidateCount(0); return; }
    const activeRanks = Object.entries(rankVisibility)
      .filter(([_, vis]) => vis)
      .map(([r]) => parseInt(r));
    const threshold = minAreaHa * 10000; // sqm
    const count = candidateFeatures.filter(f => {
      const props = f.properties || {};
      const area = Number(props.area_sqm || 0);
      const rank = Number(props.rank || 0);
      const rankOk = activeRanks.length ? activeRanks.includes(rank) : false;
      return area >= threshold && rankOk;
    }).length;
    setCandidateCount(count);
  }, [candidateFeatures, rankVisibility, minAreaHa]);

  const toggleVisibility = (id: string) => {
    setVisibility(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleRankVisibility = (rank: number) => {
    setRankVisibility(prev => ({
      ...prev,
      [rank]: !prev[rank]
    }));
  };

  return (
    <div className="w-full h-screen relative">
      {/* Legend / Key */}
      {sources && sources.length > 0 && (
        <div className="absolute bottom-8 right-4 z-10 bg-white/95 text-black rounded-lg backdrop-blur-sm border border-neutral-200 shadow-2xl min-w-[320px] max-h-[700px] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 border-b border-neutral-200 px-4 py-3">
            <h2 className="text-base font-bold text-neutral-900">Site Finder</h2>
            <p className="text-xs text-neutral-500 mt-1">Find land suitable for new disc golf courses</p>
          </div>

          <div className="px-4 py-4 space-y-6">
            {/* SECTION 1: CANDIDATE SITES */}
            <div>
              <div className="mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600 mb-3">Candidate Sites</h3>
                <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                  Sites are ranked by <strong>population within 20 minutes</strong> by car, bike, or foot.
                </p>
              </div>

              {/* Priority Ranking Toggle */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-neutral-700 mb-2.5">Priority Ranking</div>
                <div className="space-y-1.5">
                  {[
                    { rank: 5, label: 'Highest Priority', color: '#4a1486', desc: '1.19–1.62M people' },
                    { rank: 4, label: 'High Priority', color: '#6a51a3', desc: '616K–1.19M people' },
                    { rank: 3, label: 'Medium Priority', color: '#9e9ac8', desc: '158K–616K people' },
                    { rank: 2, label: 'Lower Priority', color: '#cbc9e2', desc: '28K–158K people' },
                    { rank: 1, label: 'Lowest Priority', color: '#f2f0f7', desc: '5–28K people' },
                  ].map(({ rank, label, color, desc }) => (
                    <div
                      key={rank}
                      className="flex items-center gap-2.5 p-2 rounded hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => toggleRankVisibility(rank)}
                    >
                      <div
                        className="w-5 h-5 rounded-sm border border-neutral-300"
                        style={{
                          backgroundColor: rankVisibility[rank] ? color : '#f3f4f6',
                          borderColor: rankVisibility[rank] ? color : '#d1d5db'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900">{label}</div>
                        <div className="text-[11px] text-neutral-500">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minimum Size Filter */}
              <div className="border-t border-neutral-200 pt-4">
                <div className="text-xs font-semibold text-neutral-700 mb-2.5">Minimum Size</div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {[2, 3, 4, 5].map((ha) => (
                    <button
                      key={ha}
                      onClick={() => setMinAreaHa(ha)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border-2 transition-all ${
                        minAreaHa === ha
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      title={`Show sites with area ≥ ${ha} hectares`}
                    >
                      {ha} ha
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-900">{candidateCount.toLocaleString()}</span> sites match
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    ({((candidateCount / (candidateFeatures.length || 1)) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: CURRENT COURSES & ACCESS ZONES */}
            <div className="border-t border-neutral-200 pt-4">
              <button
                onClick={() => setShowAccessZones(!showAccessZones)}
                className="w-full text-left flex items-center justify-between p-2 hover:bg-neutral-50 rounded transition-colors mb-2"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                    Existing Courses & Reach
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    20-minute accessible area by transport mode
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-neutral-500 transition-transform ${showAccessZones ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showAccessZones && (
                <div className="space-y-2 ml-1">
                  {/* Existing Courses */}
                  <div
                    className="flex items-center gap-2.5 p-2 rounded hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => toggleVisibility('existing-courses')}
                  >
                    <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-red-700" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-neutral-900">Existing Courses</div>
                      <div className="text-[11px] text-neutral-500">12 active locations</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility['existing-courses']}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                  </div>

                  {/* Access Zones */}
                  {[
                    { id: 'exclusions-drive', label: 'by Car', color: '#cc0000', desc: '20-min drive' },
                    { id: 'exclusions-cycle', label: 'by Bike', color: '#1e88e5', desc: '20-min cycle' },
                    { id: 'exclusions-walk', label: 'on Foot', color: '#2e7d32', desc: '20-min walk' },
                  ].map(({ id, label, color, desc }) => (
                    <div
                      key={id}
                      className="flex items-center gap-2.5 p-2 rounded hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => toggleVisibility(id)}
                    >
                      <div
                        className="w-5 h-5 rounded opacity-40"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-neutral-900">{label}</div>
                        <div className="text-[11px] text-neutral-500">{desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={visibility[id]}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            {source.layers.map((layer) => {
              // Determine if this layer should be visible based on source and rank filters
              let isVisible = visibility[source.id];
              
              // For rank-based filtering (candidates layer)
              if (isVisible && (layer.id === 'candidates-fill' || layer.id === 'candidates-label')) {
                // Dynamically update the filter based on rank visibility
                const activeRanks = Object.entries(rankVisibility)
                  .filter(([_, visible]) => visible)
                  .map(([rank, _]) => parseInt(rank));
                
                if (activeRanks.length === 0) {
                  isVisible = false;
                } else {
                  // Base area filter (area_sqm ≥ minAreaHa * 10,000)
                  const areaFilter: any = ['>=', ['get', 'area_sqm'], ['*', 10000, minAreaHa]];
                  let filter: any = areaFilter;
                  if (activeRanks.length < 5) {
                    // Filter for active ranks only in addition to area
                    const rankFilter: any = ['in', ['get', 'rank'], ['literal', activeRanks]];
                    filter = ['all', areaFilter, rankFilter];
                  }
                  return (
                    <Layer 
                      key={layer.id} 
                      {...layer}
                      filter={filter}
                      layout={{
                        ...layer.layout,
                        visibility: isVisible ? 'visible' : 'none'
                      }}
                    />
                  );
                }
              }
              
              return (
                <Layer 
                  key={layer.id} 
                  {...layer} 
                  layout={{
                    ...layer.layout,
                    visibility: isVisible ? 'visible' : 'none'
                  }}
                />
              );
            })}
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

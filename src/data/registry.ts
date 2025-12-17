import { melbourneMetroData } from './melbourne-metro';

export interface MapDefinition {
  id: string;
  title: string;
  description: string;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
  // In a real app, this might be a URL to a fetchable GeoJSON file
  geoJsonData?: any; 
  enable3d?: boolean;
  sources?: {
    id: string;
    label?: string; // For the legend
    color?: string; // For the legend icon
    type: 'geojson'; // Currently only supporting geojson
    data: string | any;
    layers: any[];
  }[];
}

export const mapRegistry: Record<string, MapDefinition> = {
  'melbourne-metro': {
    id: 'melbourne-metro',
    title: 'Melbourne Metro Tunnel',
    description: '3D visualization of the new Metro Tunnel alignment.',
    initialViewState: {
      longitude: 144.9631,
      latitude: -37.8136,
      zoom: 13.5,
      pitch: 60,
      bearing: -20
    },
    geoJsonData: melbourneMetroData,
    enable3d: true
  },
  'disc-golf-analyser': {
    id: 'disc-golf-analyser',
    title: 'Disc Golf Location Analyser',
    description: 'Analysis of potential disc golf course locations in Melbourne, accounting for exclusion zones and existing courses.',
    initialViewState: {
      longitude: 145.0,
      latitude: -37.8,
      zoom: 10
    },
    sources: [
      {
        id: 'exclusion-zones',
        label: 'Exclusion Zones (2.4km Buffer)',
        color: '#ff3333',
        type: 'geojson',
        data: '/data/disc-golf/exclusion_zones_2_4km.geojson',
        layers: [
          {
            id: 'exclusion-fill',
            type: 'fill',
            paint: {
              'fill-color': '#ff3333',
              'fill-opacity': 0.1,
              'fill-outline-color': '#ff3333'
            }
          }
        ]
      },
      {
        id: 'candidates',
        label: 'Candidate Locations',
        color: '#ccff00',
        type: 'geojson',
        data: '/data/disc-golf/candidates_optimization_needed.geojson',
        layers: [
          {
            id: 'candidates-fill',
            type: 'fill',
            paint: {
              'fill-color': '#ccff00',
              'fill-opacity': 0.15, // More transparent to see labels
            }
          },
          {
            id: 'candidates-outline',
            type: 'line',
            paint: {
              'line-color': '#ccff00',
              'line-width': 1,
              'line-opacity': 0.8
            }
          }
        ]
      },
      {
        id: 'existing-courses',
        label: 'Existing Courses',
        color: '#00ffff',
        type: 'geojson',
        data: '/data/disc-golf/existing_courses.geojson',
        layers: [
          {
            id: 'existing-circles',
            type: 'circle',
            paint: {
              'circle-radius': 6,
              'circle-color': '#00ffff',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          },
          {
            id: 'existing-labels',
            type: 'symbol',
            layout: {
              'text-field': ['get', 'name'],
              'text-offset': [0, 1.5],
              'text-size': 11,
              'text-variable-anchor': ['top', 'bottom', 'left', 'right']
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 2
            }
          }
        ]
      }
    ]
  },
  'melbourne-districts': {
    id: 'melbourne-districts',
    title: 'Melbourne Districts',
    description: 'A sample map showing districts in Melbourne.',
    initialViewState: {
      longitude: 144.9631,
      latitude: -37.8136,
      zoom: 11
    },
    geoJsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Central Business District' },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [144.95, -37.80],
              [144.97, -37.80],
              [144.97, -37.82],
              [144.95, -37.82],
              [144.95, -37.80]
            ]]
          }
        }
      ]
    }
  },
  'dolmenwood': {
    id: 'dolmenwood',
    title: 'Dolmenwood Hex Map',
    description: 'The mystical forest of Dolmenwood.',
    initialViewState: {
      longitude: -1.5,
      latitude: 51.0,
      zoom: 9
    },
    // No data yet, just a view
  }
};

export function getMap(slug: string): MapDefinition | null {
  return mapRegistry[slug] || null;
}

export function getAllMaps(): MapDefinition[] {
  return Object.values(mapRegistry);
}

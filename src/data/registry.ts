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
  methodology?: string;
  sources?: {
    id: string;
    label?: string; // For the legend
    color?: string; // For the legend icon
    legendItems?: { label: string; color: string }[];
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
  'disc-golf-course-sieve': {
    id: 'disc-golf-course-sieve',
    title: 'Disc Golf Course Sieve',
    description: 'Identifying the most suitable public land for new disc golf courses in Melbourne based on accessibility and land suitability.',
    methodology: `**Methodology: The Sieve Process**

The goal of this tool is to identify underutilized public land that is highly accessible to the community.

**1. Candidate Extraction**
*   **Source:** Vicmap Property (Crown Land) & OSM Parks.
*   **Filters:** 
    *   Must be Crown Land / Public Open Space.
    *   Minimum Area: 2 Hectares (sufficient for 9 holes).
    *   **Exclusions:** Schools, Sports Ovals, Airports, Golf Courses, and Cemeteries are removed.

**2. Accessibility Scoring (The "20-Minute City")**
*   We calculate a 20-minute walking/cycling isochrone for every candidate site.
*   We sum the ABS Population (2024 ERP) living within that catchment.
*   Sites are ranked 1 (Low) to 5 (High) based on the population served.

**3. Ranking System**
*   **Rank 5 (Purple):** Top 20% of sites (Highest population reach).
*   **Rank 1 (Yellow):** Bottom 20% of sites.
`,
    initialViewState: {
      longitude: 145.0,
      latitude: -37.8,
      zoom: 10
    },
    sources: [
      {
        id: 'candidates',
        label: 'Candidate Sites (Ranked)',
        type: 'geojson',
        data: '/data/disc-golf/candidates.geojson',
        legendItems: [
          { label: 'Rank 5: 1.19M–1.62M population reach', color: '#4a1486' }, // Deep Purple
          { label: 'Rank 4: 616K–1.19M population reach', color: '#6a51a3' },
          { label: 'Rank 3: 158K–616K population reach', color: '#9e9ac8' },
          { label: 'Rank 2: 28K–158K population reach', color: '#cbc9e2' },
          { label: 'Rank 1: 5–28K population reach', color: '#f2f0f7' }, // Very Light Purple
        ],
        layers: [
          {
            id: 'candidates-fill',
            type: 'fill',
            paint: {
              'fill-color': [
                'step',
                ['get', 'rank'],
                '#f2f0f7', // Default/Rank 1
                2, '#cbc9e2',
                3, '#9e9ac8',
                4, '#6a51a3',
                5, '#4a1486'
              ],
              'fill-opacity': 0.85,
              'fill-outline-color': '#ffffff'
            }
          },
          {
            id: 'candidates-label',
            type: 'symbol',
            layout: {
              'text-field': ['get', 'label'],
              'text-size': 10,
              'text-variable-anchor': ['center', 'top', 'bottom'],
              'text-justify': 'auto'
            },
            paint: {
              'text-color': '#3f007d',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1.5
            },
            minzoom: 12
          }
        ]
      },
      {
        id: 'existing-courses',
        label: 'Existing Courses',
        type: 'geojson',
        data: '/data/disc-golf/existing_courses.geojson',
        color: '#e31a1c',
        layers: [
          {
            id: 'existing-courses-glow',
            type: 'circle',
            paint: {
              'circle-radius': 18,
              'circle-color': '#e31a1c',
              'circle-opacity': 0.3,
              'circle-blur': 0.8
            }
          },
          {
            id: 'existing-courses-point',
            type: 'circle',
            paint: {
              'circle-radius': 10,
              'circle-color': '#e31a1c',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff'
            }
          },
          {
            id: 'existing-courses-label',
            type: 'symbol',
            layout: {
              'text-field': ['get', 'name'],
              'text-size': 12,
              'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.5],
              'text-anchor': 'top'
            },
            paint: {
              'text-color': '#b10026',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2.5
            }
          }
        ]
      },
      {
        id: 'exclusions',
        label: 'Exclusion Zones',
        type: 'geojson',
        data: '/data/disc-golf/exclusion_zones_2_4km.geojson',
        color: '#999999',
        layers: [
          {
            id: 'exclusions-fill',
            type: 'fill',
            paint: {
              'fill-color': '#999999',
              'fill-opacity': 0.2
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

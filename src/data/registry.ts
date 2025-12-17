export interface MapDefinition {
  id: string;
  title: string;
  description: string;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  // In a real app, this might be a URL to a fetchable GeoJSON file
  geoJsonData?: any; 
}

export const mapRegistry: Record<string, MapDefinition> = {
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

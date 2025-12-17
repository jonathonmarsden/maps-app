export const melbourneMetroData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Metro Tunnel",
        status: "Under Construction"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [144.933, -37.799], // Kensington
          [144.945, -37.802], // North Melbourne
          [144.956, -37.808], // Parkville
          [144.962, -37.810], // State Library
          [144.967, -37.814], // Town Hall
          [144.973, -37.828], // Anzac
          [144.998, -37.839]  // South Yarra
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Station: State Library"
      },
      geometry: {
        type: "Point",
        coordinates: [144.962, -37.810]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Station: Town Hall"
      },
      geometry: {
        type: "Point",
        coordinates: [144.967, -37.814]
      }
    }
  ]
};

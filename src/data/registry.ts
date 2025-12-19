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
  'disc-golf-site-finder': {
    id: 'disc-golf-site-finder',
    title: 'Disc Golf Site Finder',
    description: 'Find the most accessible public land for new disc golf courses in Melbourne. Rank candidates by population reach, filter by size, and view existing course coverage.',
    methodology: `# What You're Looking At

This map helps you discover the best locations for new disc golf courses in Melbourne. Every colored area you see is **real public land** that could work for a course. We've ranked each site based on how many people can easily reach it.

---

## Understanding the Map

### Purple Areas = Candidate Sites
These are pieces of **Crown Land or public parks** that meet basic requirements:
- At least 2 hectares (roughly 3 football fields)
- Not already used for schools, sports, golf, or airports
- Open space where a disc golf course could fit

**The darker the purple, the more people can reach it within 20 minutes.**

### Red Circles = Existing Courses
These are the 12 disc golf courses currently operating in Melbourne. The colored zones around them show how far people can travel to reach them in 20 minutes by different transport modes.

---

## How We Rank Sites

Every site is ranked from **Highest Priority** to **Lowest Priority** based on one key measure:

> **How many people live within a 20-minute trip?**

We calculate travel time by car, bike, and on foot, then count how many residents could reach each site in 20 minutes using any of those methods.

**Why this matters:** A course that's easy to reach for more people will get more use and serve the community better.

### The Rankings Explained

| Priority Level | Population Reach | What This Means |
|:---------------|:-----------------|:----------------|
| **Highest Priority** (Deep Purple) | 1.19–1.62 million | Inner suburbs with excellent access |
| **High Priority** (Dark Purple) | 616K–1.19 million | Well-connected urban areas |
| **Medium Priority** (Purple) | 158K–616K | Suburban areas with good access |
| **Lower Priority** (Light Purple) | 28K–158K | Outer suburbs or limited connections |
| **Lowest Priority** (Very Light Purple) | 5–28K | Remote areas or poor transport links |

---

## Using the Filters

### Minimum Size Control
Choose between **2, 3, 4, or 5 hectares** to see sites of different sizes:
- **2 ha:** Small courses (6–9 holes, tight layout)
- **3 ha:** Standard 9-hole course
- **4 ha:** Comfortable 9-hole course (default)
- **5 ha:** Large 9-hole or compact 18-hole course

The count below updates to show how many sites match your filter.

### Priority Toggles
Click any priority level **on or off** to hide or show those sites. This helps you focus on specific areas.

### Planning Zone Filters
Filter by planning zone suitability:
- **Public Park & Recreation (PPRZ):** Default on (most suitable)
- **Public Conservation (PCRZ):** Default off (environmentally sensitive; opt-in)
- **Public Use subcodes (PUZ1/2/3/5/6/7):** All visible as toggles. Defaults: PUZ2 (Education), PUZ3 (Health/Community), and PUZ6 (Local Government) ON; PUZ1 (Service/Utility), PUZ5 (Cemetery), PUZ7 (Other) OFF. Labels clarify each subcode.

### Transport Mode Layers
Toggle the colored zones around existing courses to see:
- **Red zones (by Car):** 20-minute driving catchment
- **Blue zones (by Bike):** 20-minute cycling catchment
- **Green zones (on Foot):** 20-minute walking catchment

These help you understand where existing courses already serve the community well.

---

## Where the Data Comes From

**Land Information:**
- **Vicmap Planning Zones** — Victorian planning scheme zoning (PPRZ, PUZ, PCRZ)
- **Vicmap Property** — Victorian government land ownership records
- **OpenStreetMap** — Community-mapped parks and public spaces

**Population Data:**
- **Australian Bureau of Statistics (ABS)** — 2024 Estimated Resident Population

**Travel Times:**
- **OpenRouteService** — Real road networks and routing for car, bike, and walking

**Built With:**
Next.js, React, Mapbox GL JS, Python (GeoPandas)

---

## About Planning Zones

Every candidate site is verified against Victorian planning zones to ensure it's **legally designated for public use or recreation**:

- **PPRZ (Public Park & Recreation Zone):** Highest priority—explicitly zoned for parks and recreation
- **PUZ (Public Use Zone):** Government facilities and community-oriented land
- **PCRZ (Public Conservation & Resource Zone):** Conservation land where low-impact recreation may be allowed

By filtering to these zones, we ensure each candidate has a legal pathway to become a public disc golf course.

---

## Important Things to Know

✓ **This is a starting point**, not a final recommendation  
✓ Population estimates are modeled from 2024 data  
✓ Travel times assume normal conditions (no traffic jams, good weather)  
✓ Land suitability depends on many factors beyond this analysis (terrain, access, regulations)  
✓ Always verify site details and permissions before planning

**Questions or feedback?** This tool is built to help the disc golf community identify opportunities. Contact: [maps@jonathonmarsden.com](mailto:maps@jonathonmarsden.com)
`,
    initialViewState: {
      longitude: 145.0,
      latitude: -37.8,
      zoom: 10
    },
    sources: [
      // Render exclusions first so all labels sit above them
        {
          id: 'exclusions-drive',
          label: 'Exclusions: 20-min Drive',
          type: 'geojson',
          data: '/data/disc-golf/exclusion_zones_drive_20min.geojson',
          layers: [
            {
              id: 'exclusions-drive-fill',
              type: 'fill',
              paint: {
                'fill-color': '#cc0000',
                'fill-opacity': 0.30
              }
            }
          ]
        },
        {
          id: 'exclusions-cycle',
          label: 'Exclusions: 20-min Cycle',
          type: 'geojson',
          data: '/data/disc-golf/exclusion_zones_cycle_20min.geojson',
          layers: [
            {
              id: 'exclusions-cycle-fill',
              type: 'fill',
              paint: {
                'fill-color': '#1e88e5',
                'fill-opacity': 0.22
              }
            }
          ]
        },
        {
          id: 'exclusions-walk',
          label: 'Exclusions: 20-min Walk',
          type: 'geojson',
          data: '/data/disc-golf/exclusion_zones_walk_20min.geojson',
          layers: [
            {
              id: 'exclusions-walk-fill',
              type: 'fill',
              paint: {
                'fill-color': '#2e7d32',
                'fill-opacity': 0.18
              }
            }
          ]
        },
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
              'circle-radius': 9,
              'circle-color': '#e31a1c',
              'circle-opacity': 0.3,
              'circle-blur': 0.8
            }
          },
          {
            id: 'existing-courses-point',
            type: 'circle',
            paint: {
              'circle-radius': 5,
              'circle-color': '#e31a1c',
              'circle-stroke-width': 0
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
      }
    ]
  }
};

export function getMap(slug: string): MapDefinition | null {
  return mapRegistry[slug] || null;
}

export function getAllMaps(): MapDefinition[] {
  return Object.values(mapRegistry);
}

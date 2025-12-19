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
    description: 'Discover publicly accessible land suitable for new disc golf courses in Melbourne. Filter by population reach, size, and planning zone. Compare against existing courses.',
    methodology: `# Disc Golf Site Finder: Complete Methodology

## What This Map Does

This interactive map identifies and ranks **public land parcels** in Greater Melbourne where disc golf courses could be built. Every colored site on the map is real, zoned for public use, and has been systematically evaluated.

**Core premise:** The most valuable new disc golf courses serve the most people. A course accessible to 1 million residents will draw more players, benefit more communities, and justify public investment better than an isolated course serving 50,000 people.

We rank sites by **how many people can reach them in 20 minutes** using car, bike, or foot. Darker purple = more accessible. Lighter purple = fewer nearby residents.

---

## The Color Scale Explained

### Why Purple? (Accessibility for All Users)

We use a **purple gradient** because it works well for people with color blindness. Purple is distinct from red (existing courses) and blue/green (access zones), and the text labels reinforce every color so you never have to rely on hue alone.

### Reading the Rankings

**Rank 5: Excellent Reach** (Deep Purple)  
→ Population: 1.19–1.62 million people within 20 minutes  
→ Serves major sections of metro Melbourne. Inner suburbs, multiple transport modes (car, bus, train, bike, walk). High demand = high usage.

**Rank 4: Strong Reach** (Dark Purple)  
→ Population: 616K–1.19 million people  
→ Well-connected urban areas. Good car access; reasonable bus/train. Solid catchment from 2–3 suburbs.

**Rank 3: Good Reach** (Medium Purple)  
→ Population: 158K–616K people  
→ Suburban areas with decent connectivity. Mostly car-dependent but some public transport. Serves local + nearby areas.

**Rank 2: Moderate Reach** (Light Purple)  
→ Population: 28K–158K people  
→ Outer suburbs or isolated pockets. Car-dependent, weak public transport, long travel times for pedestrians.

**Rank 1: Limited Reach** (Very Light Purple)  
→ Population: 5–28K people  
→ Regional/remote areas. Very sparse population, few transport options. Good for community-building but not high-traffic sites.

---

**Why the numbers matter:** The ranks aren't arbitrary. They represent bands of actual population data. A Rank 5 site reaches 1.19M+ people; a Rank 4 drops to 616K. This natural clustering helps you understand scale.

---

## How We Built This: Step-by-Step

### Step 1: Start with Existing Courses

We identified **12 active disc golf courses** operating in Victoria using the Disc Golf Australia registry:
- Hilly Fields, Tecoma
- Black Spur, Narbethong
- Laurie Kavanagh, Ivanhoe
- And 9 others across the metro area

Why start here? These courses show where community demand already exists and where disc golf infrastructure is proven.

### Step 2: Map 20-Minute Access Zones

For each existing course, we calculated three reach zones using **real road networks**:

- **Driving (Red):** Areas where people can drive to a course in 20 minutes (normal traffic)
- **Cycling (Blue):** Areas reachable by bike in 20 minutes (on-road routes)
- **Walking (Green):** Areas reachable on foot in 20 minutes (pedestrian paths)

A person has "access" to disc golf if they can reach **any course** in **any way** within 20 minutes. This map shows those zones so you can see which neighborhoods are already served and which have gaps.

### Step 3: Identify Candidate Land

We started with all public land in Greater Melbourne zoned for public use:
- **PPRZ (Public Park & Recreation Zone):** Parks, playgrounds, gardens, sports grounds
- **PUZ (Public Use Zone):** Schools, council facilities, health services, community centers
- **PCRZ (Public Conservation & Resource Zone):** Protected bushland, nature reserves, wetlands

Then we **removed unsuitable land**:
- Schools, TAFEs, universities (education facilities)
- Golf courses, driving ranges (dedicated golf)
- Airports, airstrips (aviation)
- Sports ovals, tennis courts, netball courts (sports facilities with fixed infrastructure)
- Sites smaller than 2 hectares (too small for a course)
- Hard-coded exclusions (some facilities can't be excluded by rules, so we manually block them)

This left thousands of potential sites.

### Step 4: Filter for Practical Playability

Not all empty public land is equally suitable. Disc golf needs:
- **Space:** At least 2 hectares (20,000 m²), roughly 3 football fields
- **Clearance:** Minimal obstruction from sports infrastructure and buildings

We measured obstruction by:
1. Taking OSM data on sports facilities and buildings
2. "Eroding" (expanding) sports facilities by 12 meters in all directions
3. "Eroding" buildings by 7 meters in all directions
4. Calculating the percentage overlap with each candidate site
5. Excluding sites where >30% is sports facilities or >20% is buildings

This automated step removes sites that *look* open but are actually cluttered.

### Step 5: Calculate Population Reach

For each remaining site, we:
1. Drew a 20-minute travel boundary from the site using car, bike, and walk times
2. Counted all residents within that boundary using **ABS 2024 Estimated Resident Population** data
3. Used the highest population figure (the broadest reach) as the rank metric

This gives each site a population score: e.g., 1.2 million residents can reach this site in 20 minutes.

### Step 6: Rank and Bucket Sites

We sorted all sites by population reach and grouped them into **5 ranks** representing natural bands:
- **Rank 5:** Top 10% (1.19M+ people)
- **Rank 4:** Next 20% (616K–1.19M)
- **Rank 3:** Middle 30% (158K–616K)
- **Rank 2:** Next 20% (28K–158K)
- **Rank 1:** Bottom 20% (5–28K)

Darker colors = higher ranks = more accessible.

---

## Core Assumptions (You Should Know These)

### 1. Population Data Is Approximate
**Assumption:** ABS population data at small geographic areas is uniformly distributed.

**Reality:** Density varies within suburbs. A neighborhood might have a 2,000-person area with 1,200 near transit and 800 in parks. Our model treats it as 2,000 distributed evenly.

**Impact:** Population reach numbers are estimates, not precise counts. Use ranks (Rank 5 vs. Rank 1) more than exact numbers (1.2M vs. 1.19M).

### 2. Travel Times Are "Normal"
**Assumption:** 20-minute travel times use historical averages (not rush-hour congestion, not good-weather cycling).

**Reality:** A site might be unreachable by car in peak hour but accessible at 6 AM. Conversely, a cycling route might be unsafe in winter.

**Impact:** Reach is *optimistic*. Real accessibility varies by time of day and season.

### 3. Existing Courses Represent Demand
**Assumption:** The 12 existing courses show where disc golfers play and where community interest exists.

**Reality:** These courses may be biased toward established player hubs. Underserved areas might have no courses *because* there's been no champion to build one, not because demand doesn't exist.

**Impact:** Rank 1 sites aren't valueless. A remote site might inspire a new community. Use ranks to guide initial search, not to eliminate options.

### 4. All Remaining Sites Are Equally Buildable
**Assumption:** Once a site passes our filters, it's ready to build on.

**Reality:** Sites vary wildly:
- **Terrain:** Slopes, water, rocky outcrops make some sites expensive
- **Community support:** Some councils actively encourage disc golf; others don't
- **Land control:** Crown land, council land, and community land have different approval pathways
- **Competing uses:** A park might be slated for a sports pavilion or playground
- **Access:** Some sites have poor public access or no parking

**Impact:** Ranking by population reach doesn't capture buildability. A Rank 5 site controlled by a hostile council is less viable than a Rank 3 site with a supportive community.

---

## Key Limitations

### What This Map Does NOT Tell You

1. **Terrain & Topography**
   - We don't model hills, water, trees, or native vegetation
   - A flat, open Rank 3 site might be better than a steep, dense Rank 5 site

2. **Local Permission**
   - Being zoned for public use doesn't guarantee approval
   - You'll still need council sign-off, environmental assessment (if needed), and community consultation

3. **Land Ownership**
   - We use zoning, not ownership records
   - Some zoned land is privately owned or controlled by other agencies
   - Always verify land tenure before proceeding

4. **Operational Viability**
   - Ranking accounts for population reach, not operations cost
   - Maintenance, insurance, liability, volunteer availability, and local support are not modeled

5. **Future Changes**
   - Planning zones change
   - Population distribution shifts (especially in fast-growing suburbs)
   - Existing courses may expand or close
   - This data will become outdated in 2–3 years

---

## Using the Filters

### Reach Ranking Toggle
Click any rank **on/off** to show or hide sites at that accessibility level. Use this to focus your search:
- Exploring *high-traffic* opportunities? Show only Rank 5–4
- Interested in *underserved communities*? Show only Rank 1–2
- Want to see *everything*? Keep all ranks on

### Minimum Size Filter
Choose between **2, 3, 4, or 5 hectares**:
- **2 ha:** Tightest possible 9-hole course; minimal margins
- **3 ha:** Comfortable 9-hole layout; room for amenities
- **4 ha:** Standard default; good for most courses
- **5 ha+:** Large 9-hole or compact 18-hole; future expansion possible

The site count below shows how many candidates meet your criteria.

### Planning Zone Filters
Fine-tune by zone type:

**PPRZ (Public Park & Recreation):** Default ON. Land explicitly zoned for parks and public recreation. Easiest approval pathway.

**PCRZ (Public Conservation):** Default OFF. Protected environmental areas. May require environmental assessment. Click ON if you're willing to navigate conservation approvals.

**PUZ Subcodes (all variants):** Each shows the specific subcode:
- **PUZ1 (Service/Utility):** Water treatment, power substations. Usually inappropriate for courses.
- **PUZ2 (Education):** Schools, TAFEs, universities. May allow recreational use as secondary use. Default ON.
- **PUZ3 (Health/Community):** Hospitals, health centers, community facilities. May allow mixed use. Default ON.
- **PUZ5 (Cemetery):** Cemeteries, crematoria. Usually inappropriate for courses. Default OFF.
- **PUZ6 (Local Government):** Council depots, offices, service yards. May have recreation areas. Default ON.
- **PUZ7 (Other):** Miscellaneous. Usually specialist facilities. Default OFF.

Combine filters to find sites that match your criteria *and* your council's planning preferences.

### Transport Access Zones
Toggle the colored rings around existing courses:
- **Red (Car):** People who can drive to a course in 20 minutes
- **Blue (Bike):** People who can cycle in 20 minutes
- **Green (Walk):** People who can walk in 20 minutes

Use these to identify *gaps*—areas with no 20-minute access to any existing course. These gaps are opportunities for new courses.

---

## Data & Technology

### Where the Data Comes From

**Land & Planning:**
- **Vicplan (Victorian Planning Zones):** Official zoning data from the Victorian Department of Jobs, Precincts and Regions. Updated regularly; current version from publication date.
- **OpenStreetMap (OSM):** Community-maintained land use database. Data quality varies by area; urban areas are more complete than rural areas.
- **Disc Golf Australia Registry:** Current active courses as of the map publication date.

**Population:**
- **Australian Bureau of Statistics (ABS) Estimated Resident Population (2024):** Official population estimates at Statistical Area Level 2 (SA2). Distributed across small areas for travel analysis.

**Travel Times:**
- **OpenRouteService (ORS):** Open-source routing engine using OpenStreetMap road networks. Calculates realistic car, bike, and walk times.

### How It's Built (Tech Stack)

**Frontend (What You See):**
- **Next.js 16:** Modern React framework for fast, mobile-first web apps
- **React 19:** Component library for interactive UI
- **Mapbox GL JS 3.9:** Vector maps with real-time layer filtering and custom styling
- **Tailwind CSS 4:** Utility-first styling with responsive design
- **React Markdown:** Renders this guide as formatted text

**Backend & Data Processing:**
- **Python 3.11:** GIS scripting and data analysis
- **GeoPandas:** Spatial data manipulation
- **Shapely:** Geometric operations (buffering, erosion, intersection)
- **Pyogrio:** Reading GIS files (GeoPackage, GeoJSON)
- **Rtree:** Spatial indexing for fast location queries
- **OpenRouteService API:** Travel time calculations

**Data Pipeline:**
1. Extract zoning and land use data from Vicplan/OSM GeoPackage
2. Filter to suitable zones and remove exclusions
3. Erode sports/buildings using Shapely buffers
4. Calculate 20-minute reach zones via OpenRouteService
5. Count population within reach zones
6. Rank sites and export to GeoJSON
7. Deploy GeoJSON to map frontend via Next.js public folder

---

## Cartographic Design Choices

### Why This Map Looks the Way It Does

**Purple gradient scale:** Distinct from red/blue/green for colorblind accessibility. Intensity increases from very light (1–28K pop) to deep (1.19M+ pop), making accessibility immediately visual.

**Legend on the right:** Mobile-optimized placement keeps it readable on small screens without covering the map. Sticky header shows map title and "How It Works" button.

**Rank toggles + zone filters:** Stacked UI lets users combine multiple criteria without overwhelming the interface. Checkboxes for zones, toggle switches for ranks, buttons for size.

**Existing courses in red:** Warm color (distinct from purple sites) shows where community already gathers. Rings show access zones so you can spot gaps.

**Site labels on map (zoom 12+):** At close zoom, each site's name appears. At wide zoom, too crowded; hidden to avoid clutter.

**Color opacity for accessibility zones:** Semi-transparent (30% car, 22% bike, 18% walk) so zones don't obscure underlying land use.

---

## Important Disclaimers

✓ **This is a research tool**, not a planning recommendation  
✓ **Always conduct on-ground surveys** before committing to a site  
✓ **Always consult the community** to gauge interest and concerns  
✓ **Always verify zoning** with your local council's planning register  
✓ **Always check land tenure** — some public land is controlled by other agencies  
✓ **Accessibility is one factor** among many. Community support, terrain, operations, and funding matter too  
✓ **This data will age.** Population, zoning, and courses change. Re-run analysis every 2–3 years

---

## Who Built This & Why

This tool was developed to help the Victorian disc golf community identify where new courses could serve the most people. It combines **community demand** (where existing courses are) with **spatial planning** (public land availability) and **population data** (who can reach each site).

The goal: Make disc golf more accessible to more Victorians by identifying high-impact locations for new courses.

**Questions or feedback?** Reach out: [maps@jonathonmarsden.com](mailto:maps@jonathonmarsden.com)

---

## Technical Glossary

- **Rank:** A score from 1–5 based on population within 20-minute reach. Higher = more accessible
- **PPRZ / PUZ / PCRZ:** Victorian planning zones defining allowed land uses
- **Erosion (buffer):** Expanding a shape outward (or shrinking inward) by a fixed distance to model obstruction
- **SA2 (Statistical Area Level 2):** Small geographic area used by ABS for population data (roughly suburb-scale)
- **OpenRouteService (ORS):** Open routing engine that calculates travel times on real road networks
- **GeoJSON:** Open format for storing geographic features (polygons, points, etc.) with properties
- **Isochrone:** A boundary showing all locations reachable within a fixed travel time
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

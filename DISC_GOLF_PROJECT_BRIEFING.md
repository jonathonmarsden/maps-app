# Disc Golf Site Finder: Project Briefing

## Executive Summary

**Disc Golf Site Finder** is an interactive web map that identifies and ranks public land parcels in Greater Melbourne where disc golf courses could be built. The tool combines official planning data, population statistics, and existing course coverage to answer one critical question: **Where can we build disc golf courses that serve the most people?**

Every colored site on the map is a real, publicly-accessible parcel of land that meets basic suitability criteria. Sites are ranked by **population accessibility**—how many people can reach each location in 20 minutes using any available transport mode (car, bike, or foot).

The tool is free, open to the community, and designed to empower clubs, councils, and planners to make evidence-based decisions about new course locations.

---

## The Problem It Solves

### The Current Challenge

Victoria has only **12 active disc golf courses**, concentrated in established disc golf hubs around Melbourne. This leaves vast areas underserved:

- **Inner suburbs** (Ivanhoe, Tecoma, Narbethong) have courses, but coverage is sparse
- **Outer suburbs** have little to no access to disc golf facilities
- **Regional areas** are almost entirely unserved

Identifying suitable locations for new courses is difficult. Club leaders, councils, and planners typically:
- Rely on anecdotal knowledge or personal experience
- Conduct manual searches through planning registers and land records
- Have no data on population accessibility or demand
- Can't easily compare candidate sites against each other

This leads to inefficient site selection and missed opportunities.

### Why This Tool Matters

**Accessibility drives participation.** Disc golf courses that serve more people attract more players, build stronger communities, and justify public investment. Yet there's been no objective, data-driven way to prioritize locations.

Disc Golf Site Finder provides that foundation. By combining:
- **Planning data** (zoning, public land availability)
- **Population data** (where people actually live)
- **Travel analysis** (how far people can reasonably travel)

The tool enables planners to:
- Identify high-impact locations serving 1M+ people
- Spot underserved neighborhoods with growth potential
- Make evidence-based pitches to councils and funders
- Avoid remote sites that may lack community support
- Compare candidate sites objectively

---

## Who Is This For?

### Primary Users

1. **Disc Golf Clubs**
   - Looking to expand beyond current locations
   - Seeking data to pitch to councils or community groups
   - Wanting to understand where demand is greatest

2. **Local Councils & Planners**
   - Evaluating land use options for council parks and facilities
   - Responding to community requests for disc golf
   - Prioritizing recreation infrastructure investments

3. **Community Groups & Parks Advocates**
   - Championing new recreation options in underserved areas
   - Building a case for projects to councils
   - Engaging residents with evidence-based proposals

4. **Disc Golf Australia & Advocacy Organizations**
   - Tracking industry growth and coverage gaps
   - Supporting clubs with objective analysis
   - Contributing to policy discussions about land access

### Secondary Users

- Researchers studying recreation infrastructure accessibility
- Urban planners interested in population-driven land use analysis
- Open-source GIS enthusiasts learning geospatial methods
- Students learning about cartography and data visualization

---

## How It Works: The Core Methodology

### The Ranking System

Sites are ranked **1–5** based on how many residents can reach them in 20 minutes using any transport mode (car, bike, or foot). Darker purple = more accessible; lighter purple = less accessible.

| **Rank** | **Population Reach** | **Interpretation** |
|:---:|:---:|:---|
| **5** | 1.19–1.62 million | Excellent Reach: Major urban centers, multiple transport modes, high demand |
| **4** | 616K–1.19 million | Strong Reach: Well-connected suburbs, good car and transit access |
| **3** | 158K–616K | Good Reach: Suburban areas with decent connectivity |
| **2** | 28K–158K | Moderate Reach: Outer suburbs, car-dependent |
| **1** | 5–28K | Limited Reach: Regional/remote areas, sparse population |

**Why population reach?** It's a proxy for demand. A course serving 1 million residents is statistically more valuable than one serving 50,000. This doesn't mean remote courses are worthless—it means they serve smaller populations and are better suited to community-building in underserved areas.

### The Data Pipeline

1. **Identify existing courses:** 12 active courses from the Disc Golf Australia registry
2. **Map service zones:** Calculate 20-minute drive/bike/walk zones from each course using real road networks
3. **List candidate sites:** All public land zoned for parks, public use, or conservation in Greater Melbourne
4. **Filter unsuitable land:** Remove schools, sports facilities, airports, and sites <2 hectares
5. **Measure obstructions:** Exclude sites dominated by sports infrastructure or buildings
6. **Calculate reach:** Count residents within 20-minute travel of each remaining site using ABS population data
7. **Rank and visualize:** Group sites into 5 ranks and display on an interactive map

---

## Data Sources & Transparency

This tool is built on official, public data:

| **Data Type** | **Source** | **Currency** | **Limitations** |
|:---|:---|:---|:---|
| **Planning Zones** | Vicplan (VIC Dept. Jobs, Precincts, Regions) | Current as published | Subject to revision; always verify with council |
| **Land Use** | OpenStreetMap | Community-maintained | Quality varies by area; urban > rural |
| **Existing Courses** | Disc Golf Australia Registry | As of map publication | May lag new course openings |
| **Population** | ABS Estimated Resident Population (2024) | 2024 | Approximation at small area level |
| **Travel Times** | OpenRouteService (open routing) | Real road networks | Average speeds; ignores congestion/weather |

**Key transparency note:** Population reach numbers are estimates, not precise counts. Use ranks (Rank 5 vs. Rank 1) more than exact numbers. Travel times assume normal conditions; real accessibility varies by time of day and season.

---

## Key Assumptions & Limitations

### What the Tool Assumes

1. **Accessibility equals value:** More accessible = more valuable. This is usually true but not always.
2. **20 minutes is "reasonable."** This is arbitrary but aligns with transport planning norms.
3. **Population is uniformly distributed.** ABS data is aggregated; real density varies.
4. **Current courses represent demand.** Existing locations may be biased toward established player hubs.
5. **Ranked sites are equally buildable.** Ranking ignores terrain, community support, and operations costs.

### What the Tool Does NOT Provide

- **Terrain & topography:** No modeling of hills, water, trees, or native vegetation
- **Detailed feasibility:** Suitability requires on-ground assessment
- **Ownership verification:** Data uses zoning, not ownership records
- **Operational viability:** No modeling of maintenance, insurance, or volunteer capacity
- **Legal certainty:** Zoning ≠ automatic permission; council approval is required

---

## Using the Tool Effectively

### For Community Planning

1. **Identify high-impact locations:** Filter to Rank 5–4 sites to find locations serving 600K+ people
2. **Spot underserved gaps:** Look for neighborhoods far from existing courses
3. **Size your site:** Use the minimum size filter to find sites matching your target layout (9-hole vs. 18-hole)
4. **Check zone eligibility:** Ensure candidate sites have a clear planning pathway (PPRZ easier than PCRZ)

### For Site Selection

1. **Start with top-ranked sites** but verify community interest first
2. **Visit sites in person** to assess terrain, access, parking, and community compatibility
3. **Engage locals** to gauge support; a Rank 5 site with no community buy-in is less viable
4. **Talk to land managers** to confirm availability and approval pathways
5. **Verify with council** current zoning; planning schemes change

### For Research & Advocacy

- **Use the data in pitches** to councils, funders, and communities
- **Export the GeoJSON** for analysis in QGIS, ArcGIS, or Python
- **Modify the methodology** (e.g., 30-minute zones) and re-run analysis
- **Cross-reference sources** to validate findings in Vicplan, OSM, and ABS data

---

## Technical Details

### Technology Stack

**Frontend:**
- Next.js 16 (React framework, serverless deployment)
- React 19 (interactive UI components)
- Mapbox GL JS 3.9 (high-performance vector map)
- Tailwind CSS 4 (responsive design)
- React Markdown (documentation rendering)

**Backend & Analysis:**
- Python 3.11 (data processing scripting)
- GeoPandas (spatial data manipulation)
- Shapely (geometric operations)
- OpenRouteService (routing & travel times)
- Rtree (spatial indexing)

**Hosting:**
- Vercel (serverless Next.js deployment, auto-scaling)
- GitHub (version control)
- Mapbox (map tiles, free tier: 50,000 views/month)

### Data Processing Pipeline

1. Extract zoning + land use from Vicplan/OSM GeoPackage
2. Filter to eligible zones; remove exclusions (schools, sports, airports)
3. Erode (shrink) sports/building buffers; exclude cluttered sites
4. Query OpenRouteService for 20-minute isochrones
5. Count population within isochrones using ABS SA2 data
6. Rank sites and export to GeoJSON
7. Deploy GeoJSON to Vercel via Next.js public folder

### Cartographic Design

- **Purple gradient:** Distinct from red (existing courses) and blue/green (access zones); colorblind-accessible
- **Mobile-first legend:** Responsive layout; works on phones and desktops
- **Real-time filtering:** Counts update as users adjust filters; no server roundtrips
- **Zoom-aware labels:** Site names appear at high zoom; hidden at wide zoom to avoid clutter

---

## Important Disclaimers

This tool is a research aid, not a planning recommendation. Before proceeding with any site:

✓ **Always conduct on-ground surveys** to verify feasibility  
✓ **Always consult the community** to gauge interest and concerns  
✓ **Always verify zoning** with your local council's planning register  
✓ **Always check land tenure** — some public land is controlled by other agencies  
✓ **Suitability is multi-dimensional.** Accessibility is one factor; terrain, operations, and support matter too  
✓ **Data will age.** Population, zoning, and courses change; re-run analysis every 2–3 years  
✓ **Not affiliated with any government agency.** This is a community tool

---

## Project History & Development

### Genesis

Disc Golf Site Finder was developed to address a gap: there was no objective, data-driven method for identifying where new disc golf courses could serve the most people in Victoria.

The project combines:
- **Spatial analysis** from GIS and cartography
- **Public sector data** (planning, population statistics)
- **Open-source tools** (OpenRouteService, OpenStreetMap)
- **Community feedback** from Victorian disc golf clubs

### Design Principles

1. **Transparency:** All data sources, assumptions, and limitations are documented
2. **Accessibility:** Open data, open methodology, colorblind-safe design
3. **Objectivity:** Rankings driven by data, not opinion
4. **Practicality:** Focuses on actionable insights for real decision-making
5. **Humility:** Clear about what the tool can and cannot tell you

### Continuous Improvement

The tool is maintained and updated as:
- New courses open or close
- Planning zones change
- Population data is refreshed
- User feedback suggests improvements

---

## Future Enhancements

Potential improvements (not yet implemented):

- **Terrain analysis:** Model hills, water, native vegetation to assess buildability
- **Community demand:** Layer self-reported interest or existing survey data
- **Funding eligibility:** Cross-reference with government grants or investment programs
- **Comparative analysis:** Scoring sites by multiple factors (reach + terrain + community support)
- **Time-series:** Track how accessibility changes as new courses open
- **International:** Adapt methodology for other states/countries
- **3D visualization:** Terrain-aware 3D map view

Community contributions are welcome; the methodology is open-source.

---

## How to Get Involved

### For Planners & Councils
- Use the tool in planning decisions and infrastructure prioritization
- Provide feedback on planning zone accuracy or land use classifications
- Share on-ground insights about sites you're evaluating

### For Disc Golf Clubs
- Use the tool to identify expansion locations
- Provide feedback on existing course data and coverage
- Share community demand insights
- Use the data in pitches to councils or funders

### For Developers & Data Scientists
- The code is open-source; fork and adapt the methodology
- Contribute improvements to data accuracy or analysis methods
- Help expand the tool to other regions

### Contact & Feedback

- **Report issues or suggest improvements:** [GitHub Issues](https://github.com/jonathonmarsden/maps.jonathonmarsden.com/issues)
- **Feedback & questions:** maps@jonathonmarsden.com
- **Disc Golf Australia connection:** Check with DGA for coordination on course registry

---

## Glossary

- **Rank:** Score 1–5 based on population within 20-minute reach. Higher = more accessible.
- **PPRZ / PUZ / PCRZ:** Victorian planning zones for Parks, Public Use, and Conservation.
- **Isochrone:** Boundary showing all locations reachable within a fixed travel time.
- **SA2 (Statistical Area Level 2):** Small geographic area used by ABS for population estimates (roughly suburb-scale).
- **OpenRouteService (ORS):** Open-source routing engine using OpenStreetMap road networks.
- **GeoJSON:** Standard web format for geographic data (points, polygons, properties).

---

## Acknowledgments

This tool was developed to serve the Victorian disc golf community. Thanks to:

- **Disc Golf Australia** for maintaining the course registry
- **OpenStreetMap contributors** for land use data
- **Australian Bureau of Statistics** for population statistics
- **OpenRouteService** for open routing infrastructure
- **Mapbox** for free map tiles and cartography
- **Vercel** for fast, scalable hosting
- Victorian disc golf clubs and players for feedback and encouragement

---

## License & Attribution

This tool and its data are provided as a community resource. If you use the data, methodology, or code:

- **Attribute the original creators** (maps.jonathonmarsden.com)
- **Cite the data sources** (Vicplan, OSM, ABS, OpenRouteService)
- **Share improvements** back to the community

The code is open-source and available on GitHub. The data (GeoJSON) is freely downloadable and usable for non-commercial purposes.

---

**Last Updated:** 2024  
**Next Review:** 2025  
**Maintenance:** Community-driven; updates as data and user feedback warrant

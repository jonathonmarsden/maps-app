# Mapbox Layer Rendering Order

## Overview

Mapbox GL JS renders layers in the order they are defined in the sources array. Layers defined first appear at the bottom; layers defined last appear on top.

## Current Layer Stack (Bottom → Top)

### 1. Candidate Sites (Purple Polygons)
- **Layer IDs:** `candidates-fill`, `candidates-label`
- **Purpose:** Show potential disc golf course locations
- **Color:** Purple gradient (light to dark based on rank)
- **Z-Position:** Bottom layer - should appear UNDER exclusion zones
- **Why:** Allows users to see which candidate sites fall within/outside existing course reach zones

### 2. Exclusion Zones (Colored Overlays)
- **Layer IDs:** 
  - `exclusions-drive-fill` (Red, 30% opacity)
  - `exclusions-cycle-fill` (Blue, 22% opacity)
  - `exclusions-walk-fill` (Green, 18% opacity)
- **Purpose:** Show 20-minute travel reach from existing courses
- **Z-Position:** Middle layers - appear OVER candidate sites but UNDER existing course markers
- **Why:** These semi-transparent overlays help identify gaps in coverage by visually showing which candidates are already served

### 3. Existing Courses (Red Circles)
- **Layer IDs:** `existing-courses-glow`, `existing-courses-point`, `existing-courses-label`
- **Purpose:** Mark locations of current disc golf courses
- **Color:** Red (#e31a1c)
- **Z-Position:** Top layer - appear OVER everything
- **Why:** Course markers should always be visible and clickable

## Visual Hierarchy Rationale

```
┌─────────────────────────────────────┐
│  Existing Courses (Red Dots)        │  ← Always visible, top priority
├─────────────────────────────────────┤
│  Exclusion Zones (Semi-transparent) │  ← Show coverage areas
│  - Red (Drive 20 min)               │
│  - Blue (Cycle 20 min)              │
│  - Green (Walk 20 min)              │
├─────────────────────────────────────┤
│  Candidate Sites (Purple Polygons)  │  ← Base layer, shows opportunities
└─────────────────────────────────────┘
```

## Key Design Decisions

1. **Candidates on Bottom:** Users need to see which sites are already within reach of existing courses. By placing candidates below the exclusion zones, gaps become immediately visible.

2. **Semi-Transparent Overlays:** Exclusion zones use low opacity (18-30%) so candidates remain visible underneath while clearly showing coverage.

3. **Existing Courses on Top:** Course markers must always be visible and identifiable. Red color contrasts with purple/blue/green to avoid confusion.

## Filter Behavior

- All layers respect their source visibility toggles in the legend
- Candidate layers additionally filter by:
  - Rank (1-5)
  - Minimum area (2-5 hectares)
  - Planning zone (PPRZ, PUZ variants, PCRZ)
- Exclusion zones and existing courses have simple on/off visibility

## Implementation Location

Layer order is defined in:
- **`src/data/registry.ts`** - `sources` array in `disc-golf-site-finder` definition
- **`src/components/MapView.tsx`** - Renders sources in order using `react-map-gl`

## Troubleshooting

**Problem:** Candidates appear above exclusion zones  
**Solution:** Check `registry.ts` - ensure candidates come BEFORE exclusions in the sources array

**Problem:** Labels not visible  
**Solution:** Symbol layers (labels) respect the same z-order. Ensure label layers come after fill layers within each source.

**Problem:** Can't click on underlying features  
**Solution:** Use `pointer-events: none` CSS or adjust layer order - top layers capture clicks first

# Maps App - The Atlas

This is the geospatial visualization engine for the `jonathonmarsden.com` ecosystem. It lives at `maps.jonathonmarsden.com`.

## Overview

The Maps App is a Next.js application designed to render high-fidelity, interactive maps using Mapbox GL JS. It uses a "Registry" pattern to easily add new map visualizations without duplicating code.

## Features

*   **Mapbox Integration:** Uses `react-map-gl` for React-friendly Mapbox bindings.
*   **3D Capabilities:** Supports 3D terrain and building extrusions.
*   **Registry System:** Centralized configuration in `src/data/registry.ts`.
*   **Static Generation:** Uses `generateStaticParams` to pre-render map pages for performance.
*   **Neon Styling:** Custom "Cyberpunk/Neon" data visualization styles.

## Adding a New Map

1.  **Prepare Data:** Create a GeoJSON file or TypeScript object (e.g., `src/data/my-new-map.ts`).
2.  **Register Map:** Open `src/data/registry.ts` and add a new entry to `mapRegistry`:
    ```typescript
    'my-new-map': {
      id: 'my-new-map',
      title: 'My New Map',
      description: 'Description here.',
      initialViewState: { ... },
      geoJsonData: myData,
      enable3d: true // Optional
    }
    ```
3.  **Deploy:** Push to `main`. The new route `/my-new-map` will be automatically generated.

## Development

1.  **Environment Variables:**
    Create a `.env.local` file with your Mapbox token:
    ```
    NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
    ```

2.  **Run Server:**
    ```bash
    npm run dev
    ```

3.  **Visit:** [http://localhost:3000/melbourne-metro](http://localhost:3000/melbourne-metro)

## Deployment

Deployed on **Vercel**.
*   **Project:** `maps-app`
*   **Domain:** `maps.jonathonmarsden.com`
*   Root (`/`) intentionally redirects to `https://jonathonmarsden.com`; only slugs (e.g., `/disc-golf-site-finder`) serve map content.

## External tools (modules pipeline)

Keep external tools in their own repos, but publish their built artifacts into this host under `public/modules/<tool>/`.

Workflow (Option B):
- Each tool stays in its own repo with its own CI.
- CI builds the tool and copies the static output into this repo’s `public/modules/<tool>/` path (e.g., via GitHub Actions artifact sync).
- The Maps host serves the artifact at `https://maps.jonathonmarsden.com/modules/<tool>/` (pure static, no server code).
- Set a 301 redirect from the tool’s old domain/path to the new `/modules/<tool>/` URL when cutting over.
- Keep secrets only in the tool repo’s CI/Vercel env; no shared secrets in this host.

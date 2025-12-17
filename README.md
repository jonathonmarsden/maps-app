# The Atlas (Maps App)

This is the dedicated Maps application for `maps.jonathonmarsden.com`.
It is built with Next.js and Mapbox (`react-map-gl`).

## 🚀 Getting Started

### 1. Mapbox Token
You need a Mapbox Access Token to render the maps.
1.  Go to [Mapbox.com](https://mapbox.com) and sign up/login.
2.  Create a public access token.
3.  Create a file named `.env.local` in this folder:
    ```bash
    NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoiam9uYXRob25tYXJzZGVuIi...
    ```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## 📦 Deployment

### 1. GitHub
Create a new repository for this folder (e.g., `jonathonmarsden/maps-app`).
```bash
gh repo create maps-app --public --source=. --remote=origin --push
```

### 2. Vercel
1.  Import the `maps-app` repository into Vercel.
2.  **Important:** Add the `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable in the Vercel Project Settings.
3.  Add the domain `maps.jonathonmarsden.com`.

### 3. DNS
In Cloudflare, add a CNAME record:
- **Name:** `maps`
- **Target:** `cname.vercel-dns.com`

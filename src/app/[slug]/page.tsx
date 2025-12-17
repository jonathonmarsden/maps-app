import { getMap, getAllMaps } from '@/data/registry';
import MapView from '@/components/MapView';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const maps = getAllMaps();
  return maps.map((map) => ({
    slug: map.id,
  }));
}

// In Next.js 15, params is a Promise
export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapData = getMap(slug);

  if (!mapData) {
    notFound();
  }

  return (
    <div className="relative w-full h-screen">
      {/* Overlay Title */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-md">
        <h1 className="text-xl font-bold mb-1">{mapData.title}</h1>
        <p className="text-sm text-gray-300">{mapData.description}</p>
      </div>

      <MapView 
        initialViewState={mapData.initialViewState} 
        geoJsonData={mapData.geoJsonData}
        enable3d={mapData.enable3d}
        title={mapData.title}
        sources={mapData.sources}
        methodology={mapData.methodology}
      />
    </div>
  );
}

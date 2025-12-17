import { getMap, getAllMaps } from '@/data/registry';
import MapView from '@/components/MapView';
import { notFound } from 'next/navigation';
import MethodologyPanel from '@/components/MethodologyPanel';
import type { Metadata } from 'next';
import MapPageClient from './MapPageClient';

export async function generateStaticParams() {
  const maps = getAllMaps();
  return maps.map((map) => ({
    slug: map.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mapData = getMap(slug);

  if (!mapData) {
    return {
      title: 'Map Not Found',
    };
  }

  return {
    title: mapData.title,
    description: mapData.description,
  };
}

// In Next.js 15, params is a Promise
export default async function MapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mapData = getMap(slug);

  if (!mapData) {
    notFound();
  }

  return <MapPageClient mapData={mapData} />;
}

import { getAllMaps } from '@/data/registry';
import Link from 'next/link';

export default function Home() {
  const maps = getAllMaps();

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans p-8">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">The Atlas</h1>
        <p className="text-xl text-gray-400">
          A collection of interactive maps and spatial visualizations.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {maps.map((map) => (
          <Link 
            key={map.id} 
            href={`/${map.id}`}
            className="block p-6 bg-neutral-800 rounded-xl border border-neutral-700 hover:border-blue-500 hover:bg-neutral-750 transition-all group"
          >
            <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-400">
              {map.title}
            </h2>
            <p className="text-gray-400">
              {map.description}
            </p>
          </Link>
        ))}
      </main>
    </div>
  );
}

import { redirect } from 'next/navigation';

export default function Home() {
  // Temporary debug: Show text instead of redirecting
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Maps App Root</h1>
      <p>If you see this, the Maps App is deployed and the domain is connected correctly.</p>
      <p>Links:</p>
      <ul className="list-disc ml-5">
        <li><a href="/melbourne-metro" className="text-blue-500 underline">Melbourne Metro</a></li>
        <li><a href="/debug" className="text-blue-500 underline">Debug Page</a></li>
      </ul>
    </div>
  );
  // redirect('https://jonathonmarsden.com');
}


export default function DebugPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Debug Page</h1>
      <p>If you can see this, the subdomain routing is working.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}

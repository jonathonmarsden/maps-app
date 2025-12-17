"use client";
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

interface MethodologyPanelProps {
  title: string;
  description: string;
  methodology?: string;
}

export default function MethodologyPanel({ title, description, methodology }: MethodologyPanelProps) {
  const [showMethodology, setShowMethodology] = React.useState(false);

  return (
    <>
      {/* Title and Methodology Panel */}
      <div className="absolute top-4 left-4 z-20 bg-white text-neutral-900 rounded-lg backdrop-blur-sm overflow-hidden shadow-xl border border-neutral-200 w-[420px]">
        {/* Title Section */}
        <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
          <h1 className="text-lg font-bold mb-2 leading-tight text-neutral-900">{title}</h1>
          <p className="text-sm text-neutral-600 mb-3 leading-snug">{description}</p>
          <p className="text-xs text-neutral-500 mb-3 italic">Tip: Toggle transport modes and priority ranks in the legend (bottom-right).</p>
          
          {/* Methodology Button */}
          {methodology && (
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium inline-flex items-center gap-2"
            >
              <span>{showMethodology ? '▼' : '▶'}</span>
              <span>How It Works</span>
            </button>
          )}
        </div>

        {/* Expandable Methodology Section */}
        {showMethodology && methodology && (
          <div className="px-4 py-4 bg-white max-h-[420px] overflow-y-auto">
            <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
              <style>{`
                .prose h1 { @apply text-lg font-bold text-neutral-900 mt-4 mb-2; }
                .prose h2 { @apply text-base font-bold text-neutral-800 mt-3 mb-2; }
                .prose p { @apply text-sm text-neutral-700 mb-2 leading-relaxed; }
                .prose ul { @apply text-sm text-neutral-700 mb-2 pl-4 space-y-1; }
                .prose li { @apply text-sm text-neutral-700; }
                .prose strong { @apply font-semibold text-neutral-900; }
              `}</style>
              <ReactMarkdown>{methodology}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Modal (for full view) */}
      {showMethodology && methodology && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 hidden lg:flex">
          <div className="bg-white text-neutral-900 p-8 rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 text-2xl font-light"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold mb-2">How It Works</h2>
            <p className="text-neutral-500 mb-6">Understanding the site recommendation process</p>
            <div className="prose prose-base max-w-none text-neutral-700">
              <style>{`
                .prose h1 { @apply text-2xl font-bold text-neutral-900 mt-6 mb-3; }
                .prose h2 { @apply text-xl font-bold text-neutral-800 mt-5 mb-3; }
                .prose h3 { @apply text-lg font-semibold text-neutral-800 mt-4 mb-2; }
                .prose p { @apply text-base text-neutral-700 mb-3 leading-relaxed; }
                .prose ul { @apply text-base text-neutral-700 mb-4 pl-5 space-y-2; }
                .prose li { @apply text-base text-neutral-700; }
                .prose strong { @apply font-semibold text-neutral-900; }
                .prose em { @apply italic text-neutral-600; }
              `}</style>
              <ReactMarkdown>{methodology}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

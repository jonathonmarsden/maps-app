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
      <div className="absolute top-4 left-4 z-20 bg-black/85 text-white rounded-md backdrop-blur-sm overflow-hidden shadow-lg w-[380px]">
        {/* Title Section */}
        <div className="p-3 border-b border-white/10">
          <h1 className="text-xl font-bold mb-1 leading-tight">{title}</h1>
          <p className="text-sm text-gray-300 mb-2 leading-snug">{description}</p>
          <p className="text-xs text-gray-300 mb-2 leading-snug">Toggle transport modes and suitability ranks in the legend.</p>
          
          {/* Methodology Button */}
          {methodology && (
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors font-medium"
            >
              {showMethodology ? '▼ Methodology' : '▶ Methodology'}
            </button>
          )}
        </div>

        {/* Expandable Methodology Section */}
        {showMethodology && methodology && (
          <div className="px-3 py-2 bg-black/50 border-t border-white/10 max-w-md max-h-[360px] overflow-y-auto">
            <div className="prose prose-sm prose-invert max-w-none text-gray-100">
              <ReactMarkdown>{methodology}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Modal (for full view) */}
      {showMethodology && methodology && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 hidden lg:flex">
          <div className="bg-white text-black p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowMethodology(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Methodology</h2>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{methodology}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

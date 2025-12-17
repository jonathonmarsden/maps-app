"use client";
import * as React from 'react';
import ReactMarkdown from 'react-markdown';

interface MethodologyPanelProps {
  title: string;
  description: string;
  methodology?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyPanel({ title, description, methodology, isOpen, onClose }: MethodologyPanelProps) {
  if (!isOpen || !methodology) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold leading-tight text-neutral-900">{title}</h1>
            <p className="text-sm text-neutral-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 text-2xl font-bold ml-4"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
            <style>{`
              .prose h1 { @apply text-lg font-bold text-neutral-900 mt-4 mb-2; }
              .prose h2 { @apply text-base font-bold text-neutral-800 mt-3 mb-2; }
              .prose p { @apply text-sm text-neutral-700 mb-2 leading-relaxed; }
              .prose ul { @apply text-sm text-neutral-700 mb-2 pl-4 space-y-1; }
              .prose li { @apply text-sm text-neutral-700; }
              .prose strong { @apply font-semibold text-neutral-900; }
              .prose a { @apply text-blue-600 hover:text-blue-800 underline cursor-pointer; }
            `}</style>
            <ReactMarkdown>{methodology}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
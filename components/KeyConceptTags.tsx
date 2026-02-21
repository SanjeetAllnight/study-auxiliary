'use client';

import { X } from 'lucide-react';

interface KeyConceptTagsProps {
  concepts: string[];
  onRemove?: (concept: string) => void;
  title?: string;
}

export default function KeyConceptTags({ concepts, onRemove, title = "Key Concepts" }: KeyConceptTagsProps) {
  const getTagColor = (index: number) => {
    const colors = [
      'from-blue-400 via-cyan-400 to-blue-600',
      'from-purple-400 via-pink-400 to-purple-600',
      'from-indigo-400 via-purple-400 to-indigo-600',
      'from-cyan-400 via-blue-400 to-cyan-600',
      'from-pink-400 via-rose-400 to-pink-600',
      'from-emerald-400 via-green-400 to-emerald-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="flex flex-wrap gap-3">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-r ${getTagColor(index)} text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:rotate-1 border border-white/20 backdrop-blur-sm`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            <span className="relative z-10 pr-6">{concept}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(concept)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

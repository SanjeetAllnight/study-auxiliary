'use client';

import { CheckCircle } from 'lucide-react';

interface SummaryCardsProps {
  summary: string[];
  title?: string;
}

export default function SummaryCards({ summary, title = "Summary" }: SummaryCardsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="grid gap-4">
        {summary.map((point, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-800/50 via-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-gradient-to-br hover:from-blue-700/60 hover:via-purple-700/60 hover:to-indigo-700/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mt-1 shadow-lg shadow-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <p className="text-white/95 leading-relaxed flex-1 font-medium">{point}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

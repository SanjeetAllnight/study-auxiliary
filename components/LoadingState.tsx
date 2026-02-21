'use client';

import { Loader2, Brain, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  type?: 'spinner' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingState({ 
  message = 'Processing...', 
  type = 'spinner', 
  size = 'md' 
}: LoadingStateProps) {
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  if (type === 'skeleton') {
    return (
      <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <div className="space-y-4">
          {/* Title Skeleton */}
          <div className="h-8 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl w-3/4 animate-pulse"></div>
          
          {/* Content Skeletons */}
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-blue-300/15 to-purple-300/15 rounded-lg w-full animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-blue-300/15 to-purple-300/15 rounded-lg w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-blue-300/15 to-purple-300/15 rounded-lg w-4/5 animate-pulse"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="h-12 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-xl animate-pulse shadow-lg shadow-blue-400/10"></div>
        </div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse drop-shadow-lg drop-shadow-blue-400/50" />
            <Sparkles className="w-6 h-6 text-purple-400 absolute -top-2 -right-2 animate-ping" />
            <div className="absolute inset-0 w-12 h-12 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <p className="text-white/90 text-lg font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin drop-shadow-lg drop-shadow-blue-400/50`} />
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg animate-pulse"></div>
        </div>
        <p className="text-white/90 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

// Additional loading components for specific use cases

export function CardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-800/50 via-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-pulse hover:shadow-lg hover:shadow-blue-500/20">
      <div className="space-y-4">
        <div className="h-4 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-lg w-full"></div>
        <div className="h-4 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-lg w-5/6"></div>
      </div>
    </div>
  );
}

export function TagSkeleton() {
  return (
    <div className="h-8 w-24 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 rounded-full animate-pulse shadow-lg shadow-blue-400/20 border border-white/20"></div>
  );
}

export function ButtonSkeleton() {
  return (
    <div className="h-12 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-xl animate-pulse shadow-lg shadow-blue-400/10 border border-white/20"></div>
  );
}

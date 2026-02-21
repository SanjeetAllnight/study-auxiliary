'use client';

import { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';

interface FileUploadCardProps {
  onAnalyze: (file: File, topic: string) => void;
  isLoading?: boolean;
}

export default function FileUploadCard({ onAnalyze, isLoading = false }: FileUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file, topic);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-2xl mx-auto">
      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center mb-6 cursor-pointer hover:border-white/60 transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="relative">
          <Upload className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 text-blue-400 mx-auto mb-4 blur-xl animate-pulse"></div>
        </div>
        <p className="text-white text-lg mb-2 font-medium">Drop your lecture file here</p>
        <p className="text-white/70 text-sm">PDF, DOCX, TXT, or PPTX</p>
        {file && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
            <p className="text-green-300 text-sm font-medium">✓ Selected: {file.name}</p>
          </div>
        )}
        <input
          id="file-input"
          type="file"
          accept=".pdf,.docx,.txt,.pptx"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Topic Input */}
      <div className="mb-6">
        <label className="block text-white/90 text-sm mb-2 font-medium">Topic (optional)</label>
        <input
          type="text"
          placeholder="e.g., Cell Biology, Machine Learning..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
            <span className="relative z-10">Analyzing...</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Analyze Lecture</span>
            <Sparkles className="w-5 h-5 text-yellow-300 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          </>
        )}
      </button>
    </div>
  );
}

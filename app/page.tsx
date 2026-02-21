'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Brain, Zap, GraduationCap, Star } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');

  const handleFileProcessed = async () => {
    if (!file) return;
    
    setIsLoading(true);
    // Store file data for results page
    localStorage.setItem('uploadedFile', file.name);
    localStorage.setItem('uploadedTopic', topic);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/results');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full filter blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating icons */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 text-blue-300/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 text-purple-300/30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-1/3 w-28 h-28 text-cyan-300/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <GraduationCap className="w-full h-full" />
        </motion.div>
        <motion.div
          className="absolute top-60 right-1/4 w-20 h-20 text-pink-300/30"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-full h-full" />
        </motion.div>
      </div>

      {/* Enhanced Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></div>
              </div>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Smart Lecture</span>
            <span className="text-white font-bold text-lg sm:hidden">SL</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Button variant="ghost" className="text-white hover:text-cyan-300 font-medium transition-colors">
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">🏠</span>
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 sm:px-6 py-2 rounded-full shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">📊</span>
              <Sparkles className="w-4 h-4 ml-0 sm:ml-2" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          className="max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Enhanced AI-Powered Badge */}
          <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <Star className="w-4 h-4 text-cyan-300" />
              AI-Powered Study Assistant
            </span>
          </motion.div>

          {/* Enhanced Title Section */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight">
              Smart Lecture
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Companion
            </h1>
          </motion.div>

          {/* Enhanced Subtitle */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Upload your lecture notes and get instant summaries,<br />
              key concepts, and quizzes.
            </p>
          </motion.div>

          {/* Enhanced Upload Card */}
          <motion.div
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/30 shadow-2xl shadow-purple-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Enhanced File Upload Area */}
            <div
              className="border-2 border-dashed border-cyan-400/50 rounded-2xl p-6 sm:p-8 text-center mb-6 cursor-pointer hover:border-cyan-400 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-500/10 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <div className="relative inline-block mb-4">
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <p className="text-white text-lg sm:text-xl mb-2 font-medium">Drop your lecture file here</p>
              <p className="text-white/70 text-sm sm:text-base">PDF, DOCX, TXT, or PPTX</p>
              {file && (
                <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl">
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

            {/* Enhanced Topic Input */}
            <div className="mb-6">
              <label className="block text-white/90 text-sm mb-2 font-medium">Topic (optional)</label>
              <input
                type="text"
                placeholder="e.g., Cell Biology, Machine Learning..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-cyan-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
              />
            </div>

            {/* Enhanced Analyze Button */}
            <Button
              onClick={handleFileProcessed}
              disabled={!file || isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 sm:py-5 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Lecture
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Enhanced Bottom Features */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-12 text-white/80 text-sm sm:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Instant Summaries</span>
            </div>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Key Concepts</span>
            </div>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Auto Quizzes</span>
            </div>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Smart Highlights</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

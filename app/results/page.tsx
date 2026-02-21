'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Sparkles, Brain } from 'lucide-react';
import SummaryTab from '@/components/SummaryTab';
import KeyConceptsTab from '@/components/KeyConceptsTab';
import QuizTab from '@/components/QuizTab';

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'summary' | 'concepts' | 'quiz'>('summary');
  
  // Get file info from localStorage
  const fileName = typeof window !== 'undefined' ? localStorage.getItem('uploadedFile') || 'Cell Biology — Lecture Notes.pdf' : 'Cell Biology — Lecture Notes.pdf';
  const topic = typeof window !== 'undefined' ? localStorage.getItem('uploadedTopic') || 'Cell Biology' : 'Cell Biology';

  const tabs = [
    { id: 'summary' as const, label: 'Summary' },
    { id: 'concepts' as const, label: 'Key Concepts' },
    { id: 'quiz' as const, label: 'Quiz' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full filter blur-3xl"
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
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-full filter blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Enhanced Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Smart Lecture</span>
            <span className="text-white font-bold text-lg sm:hidden">SL</span>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Button variant="ghost" className="text-white hover:text-cyan-300 font-medium transition-colors">
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">🏠</span>
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-4 sm:px-6 py-2 rounded-full shadow-lg shadow-cyan-500/30 transition-all hover:scale-105">
              <span className="hidden sm:inline">Results</span>
              <span className="sm:hidden">📊</span>
              <Sparkles className="w-4 h-4 ml-0 sm:ml-2" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Enhanced Results Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link */}
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to upload
          </motion.button>

          {/* Enhanced Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-white/70 text-lg sm:text-xl">{topic} — {fileName}</p>
          </motion.div>

          {/* Enhanced Tab Switcher */}
          <motion.div
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-2 mt-8 inline-flex shadow-lg shadow-cyan-500/20 border border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Enhanced Tab Content */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl shadow-purple-500/20">
              {activeTab === 'summary' && <SummaryTab />}
              {activeTab === 'concepts' && <KeyConceptsTab />}
              {activeTab === 'quiz' && <QuizTab />}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

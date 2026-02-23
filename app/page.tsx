'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, Brain, CheckCircle2, Lightbulb, Loader2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Concept = {
  term: string;
  definition: string;
};

type McqQuestion = {
  question: string;
  options: string[];
  answer: string;
};

type ShortQuestion = {
  question: string;
  answer: string;
};

type AnalyzeResult = {
  summary: string[];
  concepts: Concept[];
  quiz: {
    mcq: McqQuestion[];
    short: ShortQuestion[];
  };
};

const SAMPLE_LECTURE_TEXT =
  'Artificial Intelligence (AI) is the simulation of human intelligence in machines. ' +
  'It includes learning from data, reasoning about problems, and self-correction over time. ' +
  'Machine Learning is a subset of AI that improves performance using examples instead of fixed rules. ' +
  'In real-world systems, AI is used for recommendation engines, medical diagnosis support, and fraud detection.';

const EMPTY_RESULT: AnalyzeResult = {
  summary: [],
  concepts: [],
  quiz: { mcq: [], short: [] },
};

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeResult(payload: unknown): AnalyzeResult {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return EMPTY_RESULT;
  }

  const source = payload as {
    summary?: unknown;
    concepts?: unknown;
    quiz?: { mcq?: unknown; short?: unknown } | unknown;
  };

  const summary = Array.isArray(source.summary)
    ? source.summary.map(cleanText).filter(Boolean).slice(0, 5)
    : [];

  const concepts = Array.isArray(source.concepts)
    ? source.concepts
        .map((item) => {
          const concept = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
          const raw = concept as { term?: unknown; definition?: unknown };

          return {
            term: cleanText(raw.term),
            definition: cleanText(raw.definition),
          };
        })
        .filter((item) => item.term && item.definition)
        .slice(0, 3)
    : [];

  const rawQuiz = source.quiz && typeof source.quiz === 'object' && !Array.isArray(source.quiz) ? source.quiz : {};
  const rawMcq = Array.isArray((rawQuiz as { mcq?: unknown }).mcq) ? ((rawQuiz as { mcq?: unknown[] }).mcq ?? []) : [];
  const rawShort = Array.isArray((rawQuiz as { short?: unknown }).short)
    ? ((rawQuiz as { short?: unknown[] }).short ?? [])
    : [];

  const mcq = rawMcq
    .map((item) => {
      const row = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
      const raw = row as { question?: unknown; options?: unknown; answer?: unknown };

      const options = Array.isArray(raw.options) ? raw.options.map(cleanText).filter(Boolean).slice(0, 4) : [];

      return {
        question: cleanText(raw.question),
        options,
        answer: cleanText(raw.answer),
      };
    })
    .filter((item) => item.question && item.options.length === 4 && item.answer && item.options.includes(item.answer))
    .slice(0, 3);

  const short = rawShort
    .map((item) => {
      const row = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
      const raw = row as { question?: unknown; answer?: unknown };

      return {
        question: cleanText(raw.question),
        answer: cleanText(raw.answer),
      };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, 2);

  return {
    summary,
    concepts,
    quiz: { mcq, short },
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightSummaryLine(line: string, keywords: string[]) {
  if (!keywords.length) {
    return line;
  }

  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegex).join('|')})`, 'gi');
  const keywordSet = new Set(sorted.map((word) => word.toLowerCase()));
  const parts = line.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const isKeyword = keywordSet.has(part.toLowerCase());

    if (!isKeyword) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span key={`${part}-${index}`} className="font-semibold text-cyan-300">
        {part}
      </span>
    );
  });
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm animate-pulse">
        <div className="mb-4 h-5 w-40 rounded bg-white/20" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-white/20" />
          <div className="h-4 w-11/12 rounded bg-white/20" />
          <div className="h-4 w-10/12 rounded bg-white/20" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm animate-pulse">
        <div className="mb-4 h-5 w-44 rounded bg-white/20" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-24 rounded-xl bg-white/15" />
          <div className="h-24 rounded-xl bg-white/15" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm animate-pulse">
        <div className="mb-4 h-5 w-32 rounded bg-white/20" />
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-white/15" />
          <div className="h-20 rounded-xl bg-white/15" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('');
  const [lectureText, setLectureText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const canAnalyze = lectureText.trim().length > 0 && !isLoading;

  const summaryKeywords = useMemo(() => {
    if (!result) return [];

    const keywords = result.concepts
      .flatMap((concept) => concept.term.split(/[^A-Za-z0-9-]+/g))
      .map((word) => word.trim())
      .filter((word) => word.length >= 4);

    return Array.from(new Set(keywords)).slice(0, 20);
  }, [result]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleTrySample = () => {
    setLectureText(SAMPLE_LECTURE_TEXT);
    setError('');
  };

  const handleAnalyzeLecture = async () => {
    const text = lectureText.trim();
    if (!text) return;

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze?mode=normal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          payload && typeof payload === 'object' && !Array.isArray(payload) && 'message' in payload
            ? cleanText((payload as { message?: unknown }).message) || 'Request failed.'
            : 'Request failed.';

        throw new Error(message);
      }

      setResult(sanitizeResult(payload));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze lecture text.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">Smart Lecture</span>
            <span className="text-white font-bold text-lg sm:hidden">SL</span>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-white/90 text-sm font-medium border border-cyan-400/30">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            AI-Powered Study Assistant
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">Smart Lecture Companion</h1>
            <p className="text-white/85 text-lg">Upload notes, paste lecture text, and generate summary, concepts, and quiz instantly.</p>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/30 shadow-2xl shadow-purple-500/20">
            <div
              className="border-2 border-dashed border-cyan-400/50 rounded-2xl p-6 text-center mb-4 cursor-pointer hover:border-cyan-400 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-500/10 group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="w-12 h-12 text-cyan-300 mx-auto mb-3 group-hover:text-cyan-200 transition-colors" />
              <p className="text-white text-lg font-medium">Drop your lecture file here</p>
              <p className="text-white/70 text-sm">PDF, DOCX, TXT, or PPTX</p>
              {file && (
                <div className="mt-3 p-2.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl">
                  <p className="text-emerald-300 text-sm font-medium">Selected: {file.name}</p>
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

            <div className="mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleTrySample}
                className="w-full sm:w-auto border-cyan-300/60 bg-white/5 text-cyan-200 hover:bg-cyan-500/15 hover:text-cyan-100 rounded-xl"
              >
                Try Sample
              </Button>
            </div>

            <div className="mb-4">
              <label className="block text-white/90 text-sm mb-2 font-medium">Lecture Text</label>
              <textarea
                rows={7}
                placeholder="Paste lecture notes or transcript here..."
                value={lectureText}
                onChange={(event) => setLectureText(event.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-y"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white/90 text-sm mb-2 font-medium">Topic (optional)</label>
              <input
                type="text"
                placeholder="e.g., Cell Biology, Machine Learning..."
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>

            <Button
              onClick={handleAnalyzeLecture}
              disabled={!canAnalyze}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/30 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Lecture
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </Button>

            {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
          </div>
        </motion.section>

        {(isLoading || result) && (
          <motion.section
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {isLoading && <ResultsSkeleton />}

            {!isLoading && result && (
              <>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpenCheck className="w-5 h-5 text-cyan-300" />
                    <h2 className="text-xl font-semibold text-white">Summary</h2>
                  </div>
                  {result.summary.length > 0 ? (
                    <ul className="space-y-2 text-white/90">
                      {result.summary.map((line, index) => (
                        <li key={`summary-${index}`} className="flex gap-3">
                          <span className="text-cyan-300 mt-1">&bull;</span>
                          <span>{highlightSummaryLine(line, summaryKeywords)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/60 text-sm">No summary points generated.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-300" />
                    <h2 className="text-xl font-semibold text-white">Concepts</h2>
                  </div>
                  {result.concepts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {result.concepts.map((concept, index) => (
                        <div key={`${concept.term}-${index}`} className="rounded-xl border border-white/20 bg-white/5 p-4">
                          <h3 className="text-white font-semibold mb-2">{concept.term}</h3>
                          <p className="text-white/80 text-sm leading-relaxed">{concept.definition}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm">No concepts generated.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <h2 className="text-xl font-semibold text-white">Quiz</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">MCQs</h3>
                      {result.quiz.mcq.length > 0 ? (
                        <div className="space-y-4">
                          {result.quiz.mcq.map((item, questionIndex) => (
                            <div key={`mcq-${questionIndex}`} className="rounded-xl border border-white/20 bg-white/5 p-4">
                              <p className="text-white font-medium mb-3">{item.question}</p>
                              <ul className="space-y-2">
                                {item.options.map((option, optionIndex) => {
                                  const isAnswer = option === item.answer;

                                  return (
                                    <li
                                      key={`mcq-${questionIndex}-option-${optionIndex}`}
                                      className={`rounded-lg px-3 py-2 text-sm border ${
                                        isAnswer
                                          ? 'border-emerald-300/60 bg-emerald-500/20 text-emerald-100'
                                          : 'border-white/20 bg-white/5 text-white/85'
                                      }`}
                                    >
                                      {option}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60 text-sm">No MCQs generated.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-3">Short Questions</h3>
                      {result.quiz.short.length > 0 ? (
                        <div className="space-y-3">
                          {result.quiz.short.map((item, index) => (
                            <div key={`short-${index}`} className="rounded-xl border border-white/20 bg-white/5 p-4">
                              <p className="text-white font-medium mb-2">{item.question}</p>
                              <p className="text-white/80 text-sm">{item.answer}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60 text-sm">No short questions generated.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.section>
        )}
      </main>
    </div>
  );
}

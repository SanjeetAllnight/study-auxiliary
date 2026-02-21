'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Trophy, RotateCcw } from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  title?: string;
}

export default function QuizSection({ questions, onComplete, title = "Quiz" }: QuizSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <div className="relative inline-block">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-lg drop-shadow-yellow-400/50" />
            <div className="absolute inset-0 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quiz Complete!
          </h2>
          <div className="text-5xl font-bold text-white mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-xl text-white/90">
            {percentage}% Correct
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-800/50 via-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Review Answers</h3>
          <div className="space-y-3">
            {questions.map((question, index) => {
              const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
              return (
                <div key={question.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1 drop-shadow-lg drop-shadow-green-400/50" />
                  ) : (
                    <Circle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-white/95 text-sm mb-1 font-medium">
                      {index + 1}. {question.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-400 text-sm font-medium">
                        ✓ Correct: {question.options.find(opt => opt.id === question.correctAnswer)?.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <RotateCcw className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Restart Quiz</span>
          </button>
          {onComplete && (
            <button
              onClick={() => onComplete(score, questions.length)}
              className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Continue</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <span className="text-white/90 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-400/30"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </h3>
        
        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-400 bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white shadow-lg shadow-blue-400/20'
                    : 'border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-400 bg-blue-400 shadow-lg shadow-blue-400/30'
                      : 'border-white/40 hover:border-white/60'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-xl"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:opacity-50 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed hover:scale-105 disabled:scale-100"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed hover:scale-105 disabled:scale-100 hover:shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10">
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </span>
        </button>
      </div>
    </div>
  );
}

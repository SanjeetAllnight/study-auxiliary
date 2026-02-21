'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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

const quizData: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary function of cellular respiration?',
    options: [
      { id: 'a', text: 'To produce glucose for the cell' },
      { id: 'b', text: 'To convert nutrients into ATP energy' },
      { id: 'c', text: 'To break down proteins into amino acids' },
      { id: 'd', text: 'To synthesize DNA and RNA' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'q2',
    question: 'Where does glycolysis occur in the cell?',
    options: [
      { id: 'a', text: 'Mitochondrial matrix' },
      { id: 'b', text: 'Inner mitochondrial membrane' },
      { id: 'c', text: 'Cytoplasm' },
      { id: 'd', text: 'Nucleus' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 'q3',
    question: 'How many ATP molecules are approximately produced during oxidative phosphorylation?',
    options: [
      { id: 'a', text: '2-4 ATP molecules' },
      { id: 'b', text: '8-10 ATP molecules' },
      { id: 'c', text: '16-18 ATP molecules' },
      { id: 'd', text: '32-34 ATP molecules' }
    ],
    correctAnswer: 'd'
  }
];

export default function QuizTab() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [checkedAnswer, setCheckedAnswer] = useState<string | null>(null);

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
    setCheckedAnswer(null); // Reset checked answer when selecting new option
  };

  const handleCheckAnswer = () => {
    setCheckedAnswer(selectedAnswers[currentQuestion.id]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCheckedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / quizData.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-400/20 text-center max-w-2xl mx-auto shadow-2xl shadow-cyan-500/20"
      >
        <div className="mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-400/30">
            <span className="text-2xl sm:text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
          <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
            {score}/{quizData.length}
          </div>
          <div className="text-lg sm:text-xl text-white/80 mb-6">
            {percentage}% Correct
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3 mb-6">
          {quizData.map((question, index) => {
            const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
            return (
              <div key={question.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/90 text-sm sm:text-base">Question {index + 1}</span>
                <span className={`text-sm sm:text-base font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setShowResults(false);
            setCheckedAnswer(null);
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          Restart Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-cyan-400/20 max-w-2xl mx-auto shadow-2xl shadow-cyan-500/20"
    >
      {/* Question Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div className="text-white/90 font-medium text-sm sm:text-base">
          Question {currentQuestionIndex + 1} of {quizData.length}
        </div>
        <div className="flex gap-1">
          {quizData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < currentQuestionIndex ? 'bg-cyan-400' : 
                index === currentQuestionIndex ? 'bg-cyan-500 shadow-lg shadow-cyan-400/50' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 leading-relaxed">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6 sm:mb-8">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswers[currentQuestion.id] === option.id;
          const isCorrect = checkedAnswer === option.id && option.id === currentQuestion.correctAnswer;
          const isWrong = checkedAnswer === option.id && option.id !== currentQuestion.correctAnswer;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={checkedAnswer !== null}
              className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                isCorrect
                  ? 'border-green-400 bg-green-400/20 text-white shadow-lg shadow-green-400/20'
                  : isWrong
                  ? 'border-red-400 bg-red-400/20 text-white shadow-lg shadow-red-400/20'
                  : isSelected
                  ? 'border-cyan-400 bg-cyan-400/20 text-white shadow-lg shadow-cyan-400/20'
                  : 'border-white/20 bg-white/5 text-white/90 hover:border-cyan-400/50 hover:bg-cyan-400/10'
              } ${checkedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-white/40'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="font-medium text-sm sm:text-base flex-1">{option.text}</span>
                {isCorrect && <span className="ml-auto text-green-400 text-lg">✓</span>}
                {isWrong && <span className="ml-auto text-red-400 text-lg">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {checkedAnswer === null ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedAnswers[currentQuestion.id]}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            {currentQuestionIndex === quizData.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

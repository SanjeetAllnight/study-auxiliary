'use client';

import { motion } from 'framer-motion';

const concepts = [
  'ATP',
  'Glycolysis',
  'Krebs Cycle',
  'NADH',
  'FADH2',
  'Mitochondria',
  'Oxidative Phosphorylation',
  'Pyruvate'
];

const importantTerms = [
  {
    term: 'ATP (Adenosine Triphosphate)',
    definition: 'The main energy currency of the cell, used to power various cellular processes through the hydrolysis of its high-energy phosphate bonds.'
  },
  {
    term: 'NADH (Nicotinamide Adenine Dinucleotide)',
    definition: 'A coenzyme that carries electrons from glycolysis and the Krebs cycle to the electron transport chain, where they are used to generate ATP.'
  },
  {
    term: 'Mitochondrial Matrix',
    definition: 'The innermost compartment of the mitochondrion where the Krebs cycle and fatty acid oxidation take place.'
  },
  {
    term: 'Oxidative Phosphorylation',
    definition: 'The metabolic pathway that uses energy released by the oxidation of nutrients to produce ATP through the electron transport chain and chemiosmosis.'
  }
];

export default function KeyConceptsTab() {
  const getTagColor = (index: number) => {
    const colors = [
      'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300',
      'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300',
      'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-300',
      'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-indigo-300',
      'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border-rose-300',
      'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-300',
      'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 border-teal-300',
      'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-300',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Key Concepts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Key Concepts
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {concepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium ${getTagColor(index)} border hover:scale-105 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg`}
            >
              {concept}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Important Terms Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Important Terms
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {importantTerms.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-400/20 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
            >
              <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-2 sm:mb-3">{item.term}</h3>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">{item.definition}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

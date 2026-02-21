'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface SummaryItem {
  title: string;
  description: string;
}

const summaryData: SummaryItem[] = [
  {
    title: 'Cellular Respiration Overview',
    description: 'Cellular respiration is the metabolic process that converts biochemical energy from nutrients into adenosine triphosphate (ATP), and then releases waste products. This process occurs in all living cells and provides the energy needed for various cellular activities.'
  },
  {
    title: 'Glycolysis Process',
    description: 'Glycolysis is the first step in cellular respiration, occurring in the cytoplasm. It breaks down glucose into two molecules of pyruvate, producing a net gain of 2 ATP molecules and 2 NADH molecules. This anaerobic process does not require oxygen.'
  },
  {
    title: 'The Krebs Cycle',
    description: 'The Krebs Cycle, also known as the citric acid cycle, takes place in the mitochondrial matrix. It completes the oxidation of glucose, producing 2 ATP molecules, 6 NADH molecules, and 2 FADH2 molecules per glucose molecule.'
  },
  {
    title: 'Electron Transport Chain',
    description: 'The electron transport chain is the final stage of cellular respiration, located in the inner mitochondrial membrane. It uses electrons from NADH and FADH2 to generate a proton gradient, which drives the synthesis of approximately 32-34 ATP molecules through oxidative phosphorylation.'
  }
];

export default function SummaryTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {summaryData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-cyan-400/20 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20 group"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">{item.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

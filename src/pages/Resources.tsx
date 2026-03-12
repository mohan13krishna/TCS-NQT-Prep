import { motion } from 'framer-motion';
import ResourceCards from '../components/ResourceCards';
import { BookOpen } from 'lucide-react';

export default function Resources() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold gradient-text">Resources</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Top platforms for TCS NQT preparation
        </p>
      </motion.div>

      <ResourceCards />

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 shadow-lg"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">💡 Preparation Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            Practice at least 20 aptitude questions daily on PrepInsta or IndiaBix
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            Solve 1-2 coding problems on HackerRank every day
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            Take timed mock tests every week to simulate real exam conditions
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            Focus on your weak areas identified in the Progress section
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 mt-0.5">•</span>
            Revise formulas and shortcuts regularly for Quant section
          </li>
        </ul>
      </motion.div>
    </div>
  );
}

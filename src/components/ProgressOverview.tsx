import { motion } from 'framer-motion';
import { useApp } from '../context';

export default function ProgressOverview() {
  const { getOverallProgress, completedCount, totalCount } = useApp();
  const pct = getOverallProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Overall Progress</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {completedCount}/{totalCount} tasks
        </span>
      </div>

      <div className="relative mb-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-sm">{pct}%</span>
        </div>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-green-600 dark:text-green-400 font-medium">✓ {completedCount} done</span>
        <span className="text-yellow-600 dark:text-yellow-400 font-medium">◷ {totalCount - completedCount} remaining</span>
      </div>
    </motion.div>
  );
}

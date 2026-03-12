import { motion } from 'framer-motion';
import { formatShortDate, getExamDateTime } from '../data';
import DailyPlanCard from '../components/DailyPlanCard';
import { useApp } from '../context';
import { Target, CalendarDays } from 'lucide-react';

export default function StudyPlan() {
  const { getOverallProgress, completedCount, totalCount, studyPlan, state, totalStudyDays } = useApp();
  const pct = getOverallProgress();
  const examConfig = state.examConfig;
  const examStr = examConfig
    ? getExamDateTime(examConfig).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  const planRange = studyPlan.length > 0
    ? `${formatShortDate(studyPlan[0].startDate)} – ${formatShortDate(studyPlan[studyPlan.length - 1].endDate)}`
    : '';

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Target className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold gradient-text">{totalStudyDays}-Day Study Plan</h2>
        </div>
        {planRange && (
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400">{planRange} &middot; Exam on {examStr}</p>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {completedCount}/{totalCount} tasks completed &middot; {pct}% overall
        </p>
      </motion.div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Plan Progress</span>
          <span className="text-sm font-bold gradient-text">{pct}%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full ${pct === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-cyan-500'}`}
          />
        </div>
      </motion.div>

      {/* Timeline of day cards */}
      <div className="space-y-3">
        {studyPlan.map((day, i) => (
          <DailyPlanCard key={day.id} dayPlan={day} index={i} />
        ))}
      </div>
    </div>
  );
}

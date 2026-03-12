import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context';
import { CATEGORY_COLORS, getDayDateRange, getDayStatus } from '../data';
import type { DayPlan } from '../data';
import { Check, ChevronDown, ChevronUp, Trophy, Sparkles, CalendarDays } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const statusBadge: Record<string, { label: string; cls: string } | null> = {
  today: { label: 'Today', cls: 'bg-primary-500 text-white' },
  tomorrow: { label: 'Tomorrow', cls: 'bg-yellow-400 text-yellow-900' },
  past: null,
  upcoming: null,
};

export default function DailyPlanCard({ dayPlan, index }: { dayPlan: DayPlan; index: number }) {
  const { state, toggleTask, getDayProgress, markDayComplete } = useApp();
  const [expanded, setExpanded] = useState(true);
  const pct = getDayProgress(dayPlan.dayLabel);
  const allDone = dayPlan.tasks.every(t => state.completedTasks[t.id]);
  const isDayMarked = state.daysMarkedComplete[dayPlan.dayLabel];
  const prevAllDone = useRef(allDone);
  const dayStatus = getDayStatus(dayPlan);
  const badge = statusBadge[dayStatus];
  const dateRange = getDayDateRange(dayPlan);
  const isToday = dayStatus === 'today';

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  function handleMarkComplete() {
    if (allDone && !isDayMarked) {
      markDayComplete(dayPlan.dayLabel);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass rounded-2xl shadow-lg overflow-hidden transition-all relative ${
        isDayMarked ? 'ring-2 ring-green-400 dark:ring-green-500' : ''
      } ${isToday && !isDayMarked ? 'ring-2 ring-primary-400 dark:ring-primary-500 pulse-glow' : ''}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{
        background: isDayMarked ? '#22c55e'
          : isToday ? 'linear-gradient(180deg, #6366f1, #06b6d4)'
          : dayStatus === 'past' ? '#9ca3af'
          : '#e5e7eb',
      }} />

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 pl-5 text-left hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isDayMarked ? (
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isToday ? 'bg-gradient-to-br from-primary-500 to-cyan-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <span className={`font-bold text-sm ${isToday ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{dayPlan.dayNumbers[0]}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{dayPlan.dayLabel}</h3>
              {badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <CalendarDays className="w-3 h-3 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{dateRange}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mx-1">·</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dayPlan.tasks.filter(t => state.completedTasks[t.id]).length}/{dayPlan.tasks.length} tasks · {pct}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-cyan-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Tasks */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {dayPlan.tasks.map(task => {
                const done = !!state.completedTasks[task.id];
                const cat = CATEGORY_COLORS[task.category];
                return (
                  <motion.label
                    key={task.id}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      done
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleTask(task.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        done
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {done && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-animate">
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <span className={`flex-1 text-sm ${done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}`}>
                      {task.text}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                      {task.category}
                    </span>
                  </motion.label>
                );
              })}

              {allDone && !isDayMarked && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMarkComplete}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Mark Day Complete
                </motion.button>
              )}

              {isDayMarked && (
                <div className="text-center py-2">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✨ Day completed! Great work!
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

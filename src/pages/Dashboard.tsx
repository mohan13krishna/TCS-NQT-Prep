import { motion } from 'framer-motion';
import CountdownCard from '../components/CountdownCard';
import ProgressOverview from '../components/ProgressOverview';
import SubjectCards from '../components/SubjectCards';
import { useApp } from '../context';
import { getQuoteOfTheDay, getDayDateRange, getDayStatus } from '../data';
import { Flame, Target, ListChecks, Quote, Zap, ArrowRight, Clock } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const { state, studyPlan, completedCount, totalCount, totalStudyDays } = useApp();

  const todayPlan = studyPlan.find(d => getDayStatus(d) === 'today') || studyPlan[0];
  const todayTasks = todayPlan?.tasks || [];
  const todayDone = todayTasks.filter(t => state.completedTasks[t.id]).length;
  const todayDateRange = todayPlan ? getDayDateRange(todayPlan) : '';

  const daysCompleted = Object.keys(state.daysMarkedComplete).length;
  const quote = getQuoteOfTheDay();

  return (
    <div className="space-y-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-1">TCS NQT Prep Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your personalized journey to success starts here</p>
      </motion.div>

      {/* Countdown */}
      <CountdownCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-3 shadow-lg text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{state.streak}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Day Streak</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-3 shadow-lg text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{daysCompleted}/{totalStudyDays || 9}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Days Done</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-3 shadow-lg text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <ListChecks className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{completedCount}/{totalCount}</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Tasks Done</p>
        </motion.div>
      </div>

      {/* Study target */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-4 shadow-lg flex items-center gap-3"
      >
        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
          <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Daily Study Target</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">3 to 5 hours of focused study</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold gradient-text">3-5h</p>
        </div>
      </motion.div>

      {/* Overall progress */}
      <ProgressOverview />

      {/* Subject cards */}
      <SubjectCards />

      {/* Today's Focus */}
      {todayPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Today's Focus</h3>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{todayPlan.dayLabel} · {todayDateRange}</span>
          </div>
          <div className="space-y-2 mb-3">
            {todayTasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${state.completedTasks[task.id] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <span className={`text-sm ${state.completedTasks[task.id] ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {task.text}
                </span>
              </div>
            ))}
            {todayTasks.length > 4 && (
              <p className="text-xs text-gray-400">+{todayTasks.length - 4} more tasks</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">{todayDone}/{todayTasks.length} completed</span>
            <button
              onClick={() => onNavigate('plan')}
              className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              Go to Plan <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={() => onNavigate('plan')}
          className="glass rounded-2xl p-4 shadow-lg text-left group hover:shadow-xl transition-all"
        >
          <Target className="w-6 h-6 text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-semibold text-gray-800 dark:text-white">Study Plan</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">View study plan</p>
        </button>
        <button
          onClick={() => onNavigate('todos')}
          className="glass rounded-2xl p-4 shadow-lg text-left group hover:shadow-xl transition-all"
        >
          <ListChecks className="w-6 h-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-semibold text-gray-800 dark:text-white">My Todos</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage custom tasks</p>
        </button>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 shadow-lg bg-gradient-to-br from-primary-500/10 to-cyan-500/10 dark:from-primary-500/20 dark:to-cyan-500/20"
      >
        <div className="flex items-start gap-3">
          <Quote className="w-8 h-8 text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm italic text-gray-700 dark:text-gray-300 leading-relaxed">"{quote}"</p>
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-2 font-medium">Quote of the Day</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

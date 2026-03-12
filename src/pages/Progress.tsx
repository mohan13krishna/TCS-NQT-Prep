import { motion } from 'framer-motion';
import { useApp } from '../context';
import { BarChart3, TrendingUp, TrendingDown, CheckCircle2, Clock, Award, Calculator, Brain, MessageSquare, Code2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sectionMeta = [
  { key: 'Quant', label: 'Quantitative', icon: Calculator, color: '#3b82f6' },
  { key: 'Reasoning', label: 'Reasoning', icon: Brain, color: '#8b5cf6' },
  { key: 'Verbal', label: 'Verbal', icon: MessageSquare, color: '#10b981' },
  { key: 'Coding', label: 'Coding', icon: Code2, color: '#f97316' },
];

export default function Progress() {
  const { state, studyPlan, getSectionProgress, getOverallProgress, completedCount, totalCount, totalStudyDays } = useApp();

  const pct = getOverallProgress();
  const remaining = totalCount - completedCount;
  const daysCompleted = Object.keys(state.daysMarkedComplete).length;

  const sectionData = sectionMeta.map(s => ({
    ...s,
    progress: getSectionProgress(s.key),
    tasks: studyPlan.flatMap(d => d.tasks).filter(t => t.category === s.key),
  }));

  const strongest = sectionData.reduce((a, b) => a.progress >= b.progress ? a : b);
  const weakest = sectionData.reduce((a, b) => a.progress <= b.progress ? a : b);

  const pieData = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'Remaining', value: remaining, color: '#e5e7eb' },
  ];



  const dayProgressData = studyPlan.map(d => {
    const done = d.tasks.filter(t => state.completedTasks[t.id]).length;
    return {
      name: d.dayLabel.replace('Day ', 'D'),
      progress: d.tasks.length > 0 ? Math.round((done / d.tasks.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <BarChart3 className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold gradient-text">Analytics & Insights</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your preparation progress</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Overall', value: `${pct}%`, icon: Award, color: 'text-primary-500' },
          { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Remaining', value: remaining, icon: Clock, color: 'text-yellow-500' },
          { label: 'Days Done', value: `${daysCompleted}/${totalStudyDays || 9}`, icon: BarChart3, color: 'text-cyan-500' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 shadow-lg text-center"
          >
            <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-1`} />
            <p className="text-xl font-bold text-gray-800 dark:text-white">{item.value}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Strongest & Weakest */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Strongest</span>
          </div>
          <p className="font-bold text-gray-800 dark:text-white">{strongest.label}</p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">{strongest.progress}%</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-yellow-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Needs Work</span>
          </div>
          <p className="font-bold text-gray-800 dark:text-white">{weakest.label}</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">{weakest.progress}%</p>
        </motion.div>
      </div>

      {/* Completion pie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass rounded-2xl p-5 shadow-lg"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Task Completion</h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed: {completedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remaining: {remaining}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section-wise bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 shadow-lg"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Section-wise Progress</h3>
        <div className="space-y-3">
          {sectionData.map(s => (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: s.color }}>{s.progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.progress}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Day-wise chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-5 shadow-lg"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Daily Plan Progress</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 12,
                }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Bar dataKey="progress" radius={[4, 4, 0, 0]} fill="url(#barGradient)" />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-5 shadow-lg bg-gradient-to-br from-primary-500/10 to-cyan-500/10"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">📊 Weekly Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Study Streak</p>
            <p className="font-bold text-gray-800 dark:text-white">{state.streak} day{state.streak !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Days Completed</p>
            <p className="font-bold text-gray-800 dark:text-white">{daysCompleted} of {totalStudyDays || 9}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Tasks This Week</p>
            <p className="font-bold text-gray-800 dark:text-white">{completedCount} done</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Overall Grade</p>
            <p className="font-bold text-gray-800 dark:text-white">
              {pct >= 90 ? '🏆 Excellent' : pct >= 70 ? '⭐ Great' : pct >= 50 ? '💪 Good' : pct >= 25 ? '📈 Getting There' : '🚀 Just Started'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

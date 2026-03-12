import { useEffect, useState } from 'react';
import { useApp } from '../context';
import { getExamDateTime } from '../data';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CountdownCard() {
  const { state } = useApp();
  const examConfig = state.examConfig;
  const examDate = examConfig ? getExamDateTime(examConfig) : null;
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    if (!examDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    const now = new Date();
    const diff = examDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      total: diff,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  });

  if (!examConfig) return null;

  const examDisplayDate = new Date(examConfig.examDate + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Countdown to Exam</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {examDisplayDate} · {examConfig.examSession} Session
          </p>
        </div>
      </div>

      {timeLeft.total <= 0 ? (
        <div className="text-center py-4">
          <p className="text-xl font-bold gradient-text">Exam Day! 🎯</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Give it your best shot!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {units.map(u => (
              <div key={u.label} className="text-center">
                <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl py-2 px-1 mb-1">
                  <span className="text-2xl font-bold text-white tabular-nums">
                    {String(u.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-primary-500/10 to-cyan-500/10 dark:from-primary-500/20 dark:to-cyan-500/20 rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {timeLeft.days === 0
                ? "It's exam day tomorrow! Stay calm & confident 💪"
                : `You are ${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''} away from TCS NQT`}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

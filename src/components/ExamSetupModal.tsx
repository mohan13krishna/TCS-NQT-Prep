import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sun, Moon, Target, ArrowRight } from 'lucide-react';
import type { ExamConfig } from '../data';

interface Props {
  initial?: ExamConfig | null;
  onSave: (config: ExamConfig) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function ExamSetupModal({ initial, onSave, onCancel, isEdit }: Props) {
  const [examDate, setExamDate] = useState(initial?.examDate || '');
  const [session, setSession] = useState<'Morning' | 'Afternoon'>(initial?.examSession || 'Morning');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!examDate) {
      setError('Please select your exam date');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(examDate + 'T00:00:00');
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);
    if (selected <= tomorrow) {
      setError('Exam date must be at least 2 days from today');
      return;
    }
    const startTomorrow = new Date(today);
    startTomorrow.setDate(startTomorrow.getDate() + 1);
    const planStartDate = `${startTomorrow.getFullYear()}-${String(startTomorrow.getMonth() + 1).padStart(2, '0')}-${String(startTomorrow.getDate()).padStart(2, '0')}`;
    onSave({ examDate, examSession: session, planStartDate });
  }

  // Compute min date (2 days from now)
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={isEdit ? onCancel : undefined}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold gradient-text">
            {isEdit ? 'Edit Exam Plan' : 'Welcome to TCS NQT Prep!'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEdit ? 'Update your exam date and session' : "Let's set up your personalized study plan"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exam Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              <CalendarDays className="w-4 h-4 text-primary-500" />
              Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              min={minDate}
              onChange={e => { setExamDate(e.target.value); setError(''); }}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Session Toggle */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Exam Session
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSession('Morning')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  session === 'Morning'
                    ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                Morning
              </button>
              <button
                type="button"
                onClick={() => setSession('Afternoon')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  session === 'Afternoon'
                    ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg shadow-primary-500/20'
                    : 'bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                Afternoon
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Info */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-3">
            <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
              Your study plan will be generated from <strong>tomorrow</strong> until the day before your exam.
              9 preparation blocks will be spread across the available days.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {isEdit && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all active:scale-[0.98]"
            >
              {isEdit ? 'Update Plan' : 'Start My Prep'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

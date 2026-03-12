import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context';
import ResetModal from '../components/ResetModal';
import ExamSetupModal from '../components/ExamSetupModal';
import { getExamDateTime, formatShortDate } from '../data';
import type { ExamConfig } from '../data';
import { Settings as SettingsIcon, Trash2, Download, Upload, Moon, Sun, Flame, Info, CalendarDays, Edit3 } from 'lucide-react';

interface SettingsProps {
  onNavigate?: (page: string) => void;
}

export default function SettingsPage(_props: SettingsProps) {
  const { state, dark, toggleDark, resetAll, exportData, importData, setExamConfig } = useApp();
  const [showReset, setShowReset] = useState(false);
  const [showExamEdit, setShowExamEdit] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tcs-nqt-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const success = importData(result);
      setImportMsg(success ? '✅ Progress imported successfully!' : '❌ Invalid file format');
      setTimeout(() => setImportMsg(''), 3000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleReset() {
    resetAll();
    setShowReset(false);
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <SettingsIcon className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold gradient-text">Settings</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your data and preferences
        </p>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="w-5 h-5 text-primary-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Appearance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{dark ? 'Dark' : 'Light'} mode</p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-12 h-6 rounded-full transition-colors ${dark ? 'bg-primary-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </motion.div>

      {/* Exam Plan */}
      {state.examConfig && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.025 }}
          className="glass rounded-2xl p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">Exam Plan</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getExamDateTime(state.examConfig).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {' · '}
                  {state.examConfig.examSession} Session
                  {' · '}
                  Plan from {formatShortDate(state.examConfig.planStartDate)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowExamEdit(true)}
              className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/40 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Your Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Study Streak</p>
            <p className="font-bold text-gray-800 dark:text-white">{state.streak} days</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Days Completed</p>
            <p className="font-bold text-gray-800 dark:text-white">{Object.keys(state.daysMarkedComplete).length}</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Custom Todos</p>
            <p className="font-bold text-gray-800 dark:text-white">{state.customTodos.length}</p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs">Last Active</p>
            <p className="font-bold text-gray-800 dark:text-white">{state.lastActiveDate || 'N/A'}</p>
          </div>
        </div>
      </motion.div>

      {/* Export / Import */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 shadow-lg space-y-3"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Data Management</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Progress
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/60 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import Progress
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
        {importMsg && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{importMsg}</p>
        )}
      </motion.div>

      {/* Reset */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-4 shadow-lg border border-red-200 dark:border-red-900/40"
      >
        <h3 className="font-semibold text-red-600 dark:text-red-400 text-sm mb-2">Danger Zone</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          This will permanently delete all your progress, checked tasks, and custom todos.
        </p>
        <button
          onClick={() => setShowReset(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          Reset All Progress
        </button>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">About</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          TCS NQT Prep Tracker is a study planner designed to help you prepare for TCS NQT 2026 in 14 days.
          All data is stored locally in your browser — nothing is sent to any server.
        </p>
      </motion.div>

      <ResetModal
        open={showReset}
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
      />
      {showExamEdit && (
        <ExamSetupModal
          initial={state.examConfig}
          isEdit
          onSave={(config: ExamConfig) => { setExamConfig(config); setShowExamEdit(false); }}
          onCancel={() => setShowExamEdit(false)}
        />
      )}
    </div>
  );
}

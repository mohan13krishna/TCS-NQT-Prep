import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import ExamSetupModal from './components/ExamSetupModal';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';
import Todos from './pages/Todos';
import Progress from './pages/Progress';
import Resources from './pages/Resources';
import SettingsPage from './pages/Settings';
import { useApp } from './context';
import type { ExamConfig } from './data';

function App() {
  const [page, setPage] = useState('dashboard');
  const { state, setExamConfig } = useApp();

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setPage} />,
    plan: <StudyPlan />,
    todos: <Todos />,
    progress: <Progress />,
    resources: <Resources />,
    settings: <SettingsPage onNavigate={setPage} />,
  };

  function handleExamSetup(config: ExamConfig) {
    setExamConfig(config);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-50 dark:from-[#0f0e1a] dark:via-[#1a1833] dark:to-[#0d1b2a] transition-colors duration-300">
      {!state.examConfig && (
        <ExamSetupModal onSave={handleExamSetup} />
      )}
      <Header currentPage={page} onNavigate={setPage} />
      <main className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {pages[page] || <Dashboard onNavigate={setPage} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav currentPage={page} onNavigate={setPage} />
    </div>
  );
}

export default App;

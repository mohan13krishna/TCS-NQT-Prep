import { Moon, Sun, BookOpen, BarChart3, CheckSquare, Layout, Settings, Target, ExternalLink } from 'lucide-react';
import { useApp } from '../context';
import { motion } from 'framer-motion';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { dark, toggleDark } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'plan', label: 'Study Plan', icon: Target },
    { id: 'todos', label: 'Todos', icon: CheckSquare },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-lg shadow-primary-500/5">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold gradient-text leading-tight">TCS NQT Prep</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">14-Day Tracker</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                ${currentPage === item.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50'
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {currentPage === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-100 dark:bg-primary-900/40 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          ))}
          <a
            href="https://prep.aiwithnavin.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Practice
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://prep.aiwithnavin.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary-500 to-cyan-500 text-white flex items-center gap-1 active:scale-95 transition-transform"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Practice
          </a>
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-primary-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}

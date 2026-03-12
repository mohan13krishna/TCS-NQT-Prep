import { Layout, Target, CheckSquare, BarChart3, BookOpen, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Layout },
  { id: 'plan', label: 'Plan', icon: Target },
  { id: 'todos', label: 'Todos', icon: CheckSquare },
  { id: 'progress', label: 'Stats', icon: BarChart3 },
  { id: 'resources', label: 'Links', icon: BookOpen },
  { id: 'settings', label: 'More', icon: Settings },
];

export default function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20 dark:border-primary-800/30 safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-1">
        {navItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-colors min-w-[48px]"
            >
              {active && (
                <motion.div
                  layoutId="mobileActive"
                  className="absolute inset-0 bg-primary-100 dark:bg-primary-900/50 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className={`text-[10px] font-medium relative z-10 ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

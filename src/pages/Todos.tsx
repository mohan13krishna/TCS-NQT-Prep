import { motion } from 'framer-motion';
import TodoManager from '../components/TodoManager';
import { CheckSquare } from 'lucide-react';

export default function Todos() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckSquare className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold gradient-text">Todo Manager</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add and manage your personal study tasks
        </p>
      </motion.div>

      <TodoManager />
    </div>
  );
}

import { motion } from 'framer-motion';
import { ExternalLink, GraduationCap, BookOpen, Code2 } from 'lucide-react';
import { RESOURCES } from '../data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Code2,
};

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-yellow-500',
];

export default function ResourceCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {RESOURCES.map((res, i) => {
        const Icon = iconMap[res.icon] || BookOpen;
        return (
          <motion.div
            key={res.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5 shadow-lg group cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{res.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{res.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                {res.category}
              </span>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

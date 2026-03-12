import { motion } from 'framer-motion';
import { useApp } from '../context';
import { CATEGORY_COLORS } from '../data';
import { Calculator, Brain, MessageSquare, Code2 } from 'lucide-react';

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Quant: Calculator,
  Reasoning: Brain,
  Verbal: MessageSquare,
  Coding: Code2,
};

const sections = ['Quant', 'Reasoning', 'Verbal', 'Coding'];

export default function SubjectCards() {
  const { getSectionProgress } = useApp();

  return (
    <div className="grid grid-cols-2 gap-3">
      {sections.map((sec, i) => {
        const pct = getSectionProgress(sec);
        const Icon = sectionIcons[sec];
        const colors = CATEGORY_COLORS[sec];

        return (
          <motion.div
            key={sec}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`glass rounded-2xl p-4 shadow-lg border ${colors.border}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                <Icon className={`w-4 h-4 ${colors.text}`} />
              </div>
              <span className={`text-sm font-semibold ${colors.text}`}>{sec}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full"
                style={{
                  background: sec === 'Quant' ? 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                    : sec === 'Reasoning' ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                    : sec === 'Verbal' ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, #f97316, #fb923c)',
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{pct}% completed</p>
          </motion.div>
        );
      })}
    </div>
  );
}

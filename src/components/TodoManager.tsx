import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context';
import type { CustomTodo } from '../data';
import { TODO_CATEGORIES, PRIORITIES, CATEGORY_COLORS, PRIORITY_COLORS } from '../data';
import { Plus, Trash2, Edit3, Check, X, Filter } from 'lucide-react';

export default function TodoManager() {
  const { state, addTodo, updateTodo, deleteTodo, toggleTodo } = useApp();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CustomTodo['category']>('General');
  const [priority, setPriority] = useState<CustomTodo['priority']>('medium');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTodo({
      id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: trimmed,
      category,
      priority,
      completed: false,
      createdAt: Date.now(),
    });
    setText('');
  }

  function handleEdit(id: string) {
    const trimmed = editText.trim();
    if (trimmed) {
      updateTodo(id, { text: trimmed });
    }
    setEditingId(null);
  }

  const filtered = state.customTodos.filter(t => {
    if (filterCat !== 'All' && t.category !== filterCat) return false;
    if (filterStatus === 'Done' && !t.completed) return false;
    if (filterStatus === 'Pending' && t.completed) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Add form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 shadow-lg"
      >
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Add New Task</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="What do you need to study?"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-medium text-sm flex items-center gap-1 hover:shadow-lg hover:shadow-primary-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={e => setCategory(e.target.value as CustomTodo['category'])}
            className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TODO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as CustomTodo['priority'])}
            className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
          Your Tasks ({filtered.length})
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl text-sm transition-colors ${showFilters ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-2">
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="All">All Categories</option>
                {TODO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Done">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Todo list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm"
            >
              No tasks yet. Add your first study task above!
            </motion.div>
          )}
          {filtered.map(todo => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`glass rounded-xl p-3 shadow-sm flex items-center gap-3 group transition-all ${
                todo.completed ? 'opacity-70' : ''
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}
              >
                {todo.completed && <Check className="w-3 h-3 text-white" />}
              </button>

              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEdit(todo.id)}
                    className="flex-1 px-3 py-1 rounded-lg bg-white/70 dark:bg-white/10 border border-primary-300 text-sm text-gray-800 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleEdit(todo.id)} className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {todo.text}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[todo.category]?.bg || ''} ${CATEGORY_COLORS[todo.category]?.text || ''}`}>
                    {todo.category}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[todo.priority]}`}>
                    {todo.priority}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(todo.id); setEditText(todo.text); }}
                      className="p-1 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

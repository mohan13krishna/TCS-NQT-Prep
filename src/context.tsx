import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { AppState, CustomTodo, ExamConfig, DayPlan } from './data';
import { getDefaultState, generateStudyPlan } from './data';

const STORAGE_KEY = 'tcs-nqt-prep-tracker';

interface AppContextType {
  state: AppState;
  studyPlan: DayPlan[];
  dark: boolean;
  toggleDark: () => void;
  toggleTask: (taskId: string) => void;
  addTodo: (todo: CustomTodo) => void;
  updateTodo: (id: string, updates: Partial<CustomTodo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  markDayComplete: (dayLabel: string) => void;
  setExamConfig: (config: ExamConfig) => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  getOverallProgress: () => number;
  getSectionProgress: (category: string) => number;
  getDayProgress: (dayLabel: string) => number;
  completedCount: number;
  totalCount: number;
  totalStudyDays: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...getDefaultState(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return getDefaultState();
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tcs-nqt-dark');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const studyPlan = useMemo(
    () => state.examConfig
      ? generateStudyPlan(state.examConfig.examDate, state.examConfig.planStartDate)
      : [],
    [state.examConfig]
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('tcs-nqt-dark', String(dark));
  }, [dark]);

  // Streak management
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      setState(prev => ({
        ...prev,
        lastActiveDate: today,
        streak: prev.lastActiveDate === yesterday ? prev.streak + 1 : (prev.lastActiveDate === today ? prev.streak : 1),
      }));
    }
  }, [state.lastActiveDate]);

  const toggleDark = useCallback(() => setDark(d => !d), []);

  const toggleTask = useCallback((taskId: string) => {
    setState(prev => ({
      ...prev,
      completedTasks: {
        ...prev.completedTasks,
        [taskId]: !prev.completedTasks[taskId],
      },
    }));
  }, []);

  const addTodo = useCallback((todo: CustomTodo) => {
    setState(prev => ({ ...prev, customTodos: [todo, ...prev.customTodos] }));
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<CustomTodo>) => {
    setState(prev => ({
      ...prev,
      customTodos: prev.customTodos.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      customTodos: prev.customTodos.filter(t => t.id !== id),
    }));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      customTodos: prev.customTodos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    }));
  }, []);

  const markDayComplete = useCallback((dayLabel: string) => {
    setState(prev => ({
      ...prev,
      daysMarkedComplete: { ...prev.daysMarkedComplete, [dayLabel]: true },
    }));
  }, []);

  const setExamConfig = useCallback((config: ExamConfig) => {
    setState(prev => ({ ...prev, examConfig: config }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = getDefaultState();
    fresh.lastActiveDate = new Date().toISOString().slice(0, 10);
    fresh.examConfig = state.examConfig;
    setState(fresh);
  }, [state.examConfig]);

  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (parsed && typeof parsed === 'object') {
        setState({ ...getDefaultState(), ...parsed });
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, []);

  const allTasks = studyPlan.flatMap(d => d.tasks);
  const totalCount = allTasks.length;
  const completedCount = allTasks.filter(t => state.completedTasks[t.id]).length;
  const totalStudyDays = studyPlan.length > 0
    ? studyPlan[studyPlan.length - 1].dayNumbers[studyPlan[studyPlan.length - 1].dayNumbers.length - 1]
    : 0;

  const getOverallProgress = useCallback(() => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }, [completedCount, totalCount]);

  const getSectionProgress = useCallback((category: string) => {
    const tasks = allTasks.filter(t => t.category === category);
    if (tasks.length === 0) return 0;
    const done = tasks.filter(t => state.completedTasks[t.id]).length;
    return Math.round((done / tasks.length) * 100);
  }, [state.completedTasks, allTasks]);

  const getDayProgress = useCallback((dayLabel: string) => {
    const day = studyPlan.find(d => d.dayLabel === dayLabel);
    if (!day) return 0;
    const done = day.tasks.filter(t => state.completedTasks[t.id]).length;
    return Math.round((done / day.tasks.length) * 100);
  }, [state.completedTasks, studyPlan]);

  return (
    <AppContext.Provider value={{
      state, studyPlan, dark, toggleDark, toggleTask, addTodo, updateTodo,
      deleteTodo, toggleTodo, markDayComplete, setExamConfig, resetAll, exportData,
      importData, getOverallProgress, getSectionProgress, getDayProgress,
      completedCount, totalCount, totalStudyDays,
    }}>
      {children}
    </AppContext.Provider>
  );
}

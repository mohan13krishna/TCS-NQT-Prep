export interface StudyTask {
  id: string;
  text: string;
  category: 'Quant' | 'Reasoning' | 'Verbal' | 'Coding' | 'Resources' | 'General';
  completed: boolean;
}

export interface DayPlan {
  id: string;
  dayLabel: string;
  dayNumbers: number[];
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  tasks: StudyTask[];
}

export interface CustomTodo {
  id: string;
  text: string;
  category: 'Quant' | 'Reasoning' | 'Verbal' | 'Coding' | 'Revision' | 'General';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: number;
}

export interface ExamConfig {
  examDate: string;       // 'YYYY-MM-DD'
  examSession: 'Morning' | 'Afternoon';
  planStartDate: string;  // 'YYYY-MM-DD'
}

export interface AppState {
  completedTasks: Record<string, boolean>;
  customTodos: CustomTodo[];
  streak: number;
  lastActiveDate: string;
  daysMarkedComplete: Record<string, boolean>;
  examConfig: ExamConfig | null;
}

export const CATEGORIES = ['Quant', 'Reasoning', 'Verbal', 'Coding', 'Resources', 'General'] as const;
export const TODO_CATEGORIES = ['Quant', 'Reasoning', 'Verbal', 'Coding', 'Revision', 'General'] as const;
export const PRIORITIES = ['low', 'medium', 'high'] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Quant: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  Reasoning: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  Verbal: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' },
  Coding: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  Resources: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700' },
  General: { bg: 'bg-gray-100 dark:bg-gray-800/40', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600' },
  Revision: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

// ===== Curriculum Blocks (9 fixed preparation blocks) =====
interface BlockTask {
  text: string;
  category: StudyTask['category'];
}
interface CurriculumBlock {
  weight: number;
  tasks: BlockTask[];
}

const CURRICULUM_BLOCKS: CurriculumBlock[] = [
  {
    weight: 2,
    tasks: [
      { text: 'Percentages', category: 'Quant' },
      { text: 'Profit & Loss', category: 'Quant' },
      { text: 'Number series', category: 'Reasoning' },
      { text: 'Odd one out', category: 'Reasoning' },
      { text: 'Parts of speech', category: 'Verbal' },
      { text: 'Sentence correction', category: 'Verbal' },
      { text: 'Palindrome program', category: 'Coding' },
      { text: 'Factorial program', category: 'Coding' },
      { text: 'Practice on PrepInsta', category: 'Resources' },
      { text: 'Practice on IndiaBix', category: 'Resources' },
    ],
  },
  {
    weight: 2,
    tasks: [
      { text: 'Ratio & Proportion', category: 'Quant' },
      { text: 'Averages', category: 'Quant' },
      { text: 'Coding decoding', category: 'Reasoning' },
      { text: 'Blood relations', category: 'Reasoning' },
      { text: 'Synonyms / Antonyms', category: 'Verbal' },
      { text: 'Fibonacci program', category: 'Coding' },
    ],
  },
  {
    weight: 2,
    tasks: [
      { text: 'Time & Work', category: 'Quant' },
      { text: 'Time Speed Distance', category: 'Quant' },
      { text: 'Direction problems', category: 'Reasoning' },
      { text: 'Statement conclusion', category: 'Reasoning' },
      { text: 'Error spotting', category: 'Verbal' },
      { text: 'Largest element in array', category: 'Coding' },
    ],
  },
  {
    weight: 1,
    tasks: [
      { text: 'Full mock test', category: 'General' },
      { text: 'Use PrepInsta mock tests', category: 'Resources' },
    ],
  },
  {
    weight: 2,
    tasks: [
      { text: 'Simple Interest', category: 'Quant' },
      { text: 'Compound Interest', category: 'Quant' },
      { text: 'Syllogism', category: 'Reasoning' },
      { text: 'Seating arrangement', category: 'Reasoning' },
      { text: 'Reading comprehension', category: 'Verbal' },
      { text: 'Sorting array', category: 'Coding' },
    ],
  },
  {
    weight: 2,
    tasks: [
      { text: 'Probability', category: 'Quant' },
      { text: 'Data interpretation', category: 'Quant' },
      { text: 'Puzzle problems', category: 'Reasoning' },
      { text: 'Binary search', category: 'Coding' },
      { text: 'Practice coding on HackerRank', category: 'Resources' },
    ],
  },
  {
    weight: 1,
    tasks: [
      { text: 'Revise formulas', category: 'General' },
      { text: 'Solve 40 aptitude questions', category: 'Quant' },
    ],
  },
  {
    weight: 1,
    tasks: [
      { text: 'Full mock test', category: 'General' },
    ],
  },
  {
    weight: 1,
    tasks: [
      { text: 'Light revision', category: 'General' },
      { text: 'Solve 10 reasoning questions', category: 'Reasoning' },
      { text: 'Solve 1 coding question', category: 'Coding' },
      { text: 'Sleep early', category: 'General' },
    ],
  },
];

// ===== Plan Generation =====
function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dy}`;
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function allocateDays(total: number, weights: number[]): number[] {
  const n = weights.length;
  const result = new Array(n).fill(1);
  let remaining = total - n;
  if (remaining <= 0) return result;
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => (remaining * w) / totalWeight);
  const floors = raw.map(Math.floor);
  for (let i = 0; i < n; i++) result[i] += floors[i];
  remaining -= floors.reduce((a, b) => a + b, 0);
  const fracs = raw.map((r, i) => ({ i, f: r - floors[i] })).sort((a, b) => b.f - a.f);
  for (let j = 0; j < remaining; j++) result[fracs[j].i]++;
  return result;
}

/** Generate a dynamic study plan from planStartDate to the day before examDate */
export function generateStudyPlan(examDate: string, planStartDate: string): DayPlan[] {
  const start = new Date(planStartDate + 'T00:00:00');
  const exam = new Date(examDate + 'T00:00:00');
  const lastStudy = new Date(exam);
  lastStudy.setDate(lastStudy.getDate() - 1);
  const totalAvail = Math.max(9, diffDays(start, lastStudy) + 1);

  // Block 9 (index 8) always gets exactly 1 day, pinned to lastStudy
  const firstWeights = CURRICULUM_BLOCKS.slice(0, 8).map(b => b.weight);
  const alloc = allocateDays(totalAvail - 1, firstWeights);
  alloc.push(1);

  // Build from end → start so block 9 lands on lastStudy
  const plan: DayPlan[] = [];
  let cursor = new Date(lastStudy);
  for (let i = 8; i >= 0; i--) {
    const days = alloc[i];
    const endDate = new Date(cursor);
    const startDate = new Date(cursor);
    startDate.setDate(startDate.getDate() - (days - 1));
    plan.unshift({
      id: `block-${i}`,
      dayLabel: '',
      dayNumbers: [],
      startDate: fmtDate(startDate),
      endDate: fmtDate(endDate),
      tasks: CURRICULUM_BLOCKS[i].tasks.map((t, ti) => ({
        id: `b${i}-${ti}`,
        text: t.text,
        category: t.category,
        completed: false,
      })),
    });
    cursor = new Date(startDate);
    cursor.setDate(cursor.getDate() - 1);
  }

  // Compute day labels
  const planStart = new Date(plan[0].startDate + 'T00:00:00');
  for (const p of plan) {
    const s = new Date(p.startDate + 'T00:00:00');
    const e = new Date(p.endDate + 'T00:00:00');
    const sn = diffDays(planStart, s) + 1;
    const en = diffDays(planStart, e) + 1;
    p.dayNumbers = Array.from({ length: en - sn + 1 }, (_, k) => sn + k);
    p.dayLabel = sn === en ? `Day ${sn}` : `Day ${sn}\u2013${en}`;
  }
  return plan;
}

/** Get exam date+time as a Date based on config */
export function getExamDateTime(config: ExamConfig): Date {
  const time = config.examSession === 'Morning' ? 'T09:00:00' : 'T14:00:00';
  return new Date(config.examDate + time + '+05:30');
}

export const RESOURCES = [
  {
    name: 'PrepInsta',
    description: 'TCS-specific aptitude and mock test practice',
    category: 'Aptitude & Mocks',
    url: 'https://prepinsta.com/tcs-nqt/',
    icon: 'GraduationCap',
  },
  {
    name: 'IndiaBix',
    description: 'Aptitude, reasoning, and verbal practice questions',
    category: 'Aptitude & Verbal',
    url: 'https://www.indiabix.com/',
    icon: 'BookOpen',
  },
  {
    name: 'HackerRank',
    description: 'Coding practice for programming rounds',
    category: 'Coding',
    url: 'https://www.hackerrank.com/',
    icon: 'Code2',
  },
];

export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "Push yourself, because no one else is going to do it for you.",
  "Dream it. Wish it. Do it.",
  "Great things never come from comfort zones.",
  "Hard work beats talent when talent doesn't work hard.",
  "The only way to do great work is to love what you do.",
  "You don't have to be great to start, but you have to start to be great.",
  "Focus on being productive instead of busy.",
  "One day or day one. You decide.",
  "Preparation is the key to success.",
];

export function getQuoteOfTheDay(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format 'YYYY-MM-DD' → '12 Mar' */
export function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]}`;
}

/** Get date range string for a day plan, e.g. '12 Mar – 13 Mar' or '18 Mar' */
export function getDayDateRange(day: DayPlan): string {
  if (day.startDate === day.endDate) return formatShortDate(day.startDate);
  return `${formatShortDate(day.startDate)} – ${formatShortDate(day.endDate)}`;
}

/** Get the temporal status of a day block relative to today */
export function getDayStatus(day: DayPlan): 'past' | 'today' | 'tomorrow' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(day.startDate + 'T00:00:00');
  const end = new Date(day.endDate + 'T00:00:00');

  if (today >= start && today <= end) return 'today';
  if (today < start && start <= tomorrow) return 'tomorrow';
  if (today > end) return 'past';
  return 'upcoming';
}

export function getDefaultState(): AppState {
  return {
    completedTasks: {},
    customTodos: [],
    streak: 0,
    lastActiveDate: '',
    daysMarkedComplete: {},
    examConfig: null,
  };
}

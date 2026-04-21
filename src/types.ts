export type HabitCategory = 'sağlık' | 'zihinsel' | 'üretkenlik' | 'sosyal' | 'eğitim' | 'diğer';

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  'sağlık': '💪 Sağlık',
  'zihinsel': '🧠 Zihinsel',
  'üretkenlik': '⚡ Üretkenlik',
  'sosyal': '🤝 Sosyal',
  'eğitim': '📚 Eğitim',
  'diğer': '🎯 Diğer',
};

export interface Habit {
  id: string;
  name: string;
  target: number;
  completedDays: number[]; // Array of day numbers (1-31)
  color: string;
  streak: number;
  category?: HabitCategory;
  reminderTime?: string;      // e.g. "20:00"
  targetDaysPerWeek?: number; // 1-7, default 7
}

export interface MonthlyStats {
  month: string;
  continuity: number;
  dailyProgress: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

export interface YearlyStats {
  year: number;
  months: {
    name: string;
    completed: number;
    target: number;
  }[];
}

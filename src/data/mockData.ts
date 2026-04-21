import type { Habit, MonthlyStats } from '../types';

export const MOCK_HABITS: Habit[] = [];

export const MONTHLY_STATS: MonthlyStats = {
  month: 'Mart 2026',
  continuity: 138,
  dailyProgress: 71,
  weeklyProgress: 40,
  monthlyProgress: 40,
};

export const YEARLY_DATA = {
  months: [
    { name: 'Ocak', completed: 180, target: 220 },
    { name: 'Şubat', completed: 160, target: 200 },
    { name: 'Mart', completed: 196, target: 624 },
    { name: 'Nisan', completed: 0, target: 624 },
    { name: 'Mayıs', completed: 0, target: 624 },
    { name: 'Haziran', completed: 0, target: 624 },
    { name: 'Temmuz', completed: 0, target: 624 },
    { name: 'Ağustos', completed: 0, target: 624 },
    { name: 'Eylül', completed: 0, target: 624 },
    { name: 'Ekim', completed: 0, target: 624 },
    { name: 'Kasım', completed: 0, target: 624 },
    { name: 'Aralık', completed: 0, target: 624 },
  ]
};

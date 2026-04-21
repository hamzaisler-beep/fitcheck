import type { Habit, HabitCategory } from '../types';
import { CATEGORY_LABELS } from '../types';
import { CircularProgress } from './CircularProgress';
import { HabitDetailModal } from './HabitDetailModal';
import { EditHabitModal } from './EditHabitModal';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, Flame, ChevronRight, Info, GripVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const QUOTES = [
  'Küçük adımlar, büyük yolculuklar yaratır.',
  'Disiplin, motivasyonun tükendiği yerde devreye girer.',
  'Bugün yaptıkların, yarınki sen için en iyi yatırım.',
  'Mükemmel olmak gerekmez, sadece başlamak yeter.',
  'Her gün biraz daha iyi olmak, zamanla büyük fark yaratır.',
  'Alışkanlıklar, karakterin yapı taşlarıdır.',
  'Kendine verdiğin sözleri tut — o insan en önemlisi.',
  'Zorluk geçici, gurur kalıcıdır.',
  'İlerleme, mükemmellikten daha değerlidir.',
  'Her sabah yeni bir şans, yeni bir seçim.',
  'Alışkanlıklarını seç; onlar seni inşa eder.',
  'Küçük tutarlılık, aralıklı mükemmellikten iyidir.',
  'Sağlıklı bir zihin için düzenli bir beden şarttır.',
  'Bugün ekilenler, yarın biçilir.',
];

interface MonthlyDashboardProps {
  initialHabits: Habit[];
  onHabitsChange?: (habits: Habit[]) => void;
  onDeleteHabit?: (id: string) => void;
  onEditHabit?: (updated: Habit) => void;
}

export const MonthlyDashboard = ({ initialHabits, onHabitsChange, onDeleteHabit, onEditHabit }: MonthlyDashboardProps) => {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [showHistory, setShowHistory] = useState(false);
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'tümü'>('tümü');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const celebrationShownRef = useRef(false);

  useEffect(() => {
    setHabits(initialHabits);
  }, [initialHabits]);

  const now = new Date();
  const today = now.getDate();
  const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const getDayName = (dayOfMonth: number) =>
    DAY_NAMES[new Date(now.getFullYear(), now.getMonth(), dayOfMonth).getDay()];

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedDays.includes(today)).length;
  const dailyProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const daysPassedThisMonth = today;
  const totalPossibleChecks = totalHabits * daysPassedThisMonth;
  const totalActualChecks = habits.reduce((acc, h) => acc + h.completedDays.filter(d => d <= today).length, 0);
  const monthlyProgress = totalPossibleChecks > 0 ? Math.round((totalActualChecks / totalPossibleChecks) * 100) : 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => today - (6 - i)).filter(d => d > 0);
  const weeklyChecks = habits.reduce((acc, h) => acc + h.completedDays.filter(d => last7Days.includes(d)).length, 0);
  const weeklyProgress = totalHabits > 0 ? Math.round((weeklyChecks / (totalHabits * last7Days.length)) * 100) : 0;

  const continuity = totalHabits > 0 ? Math.min(100, Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / totalHabits * 10)) : 0;

  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const todayQuote = QUOTES[dayOfYear % QUOTES.length];

  useEffect(() => {
    if (totalHabits > 0 && completedToday === totalHabits && !celebrationShownRef.current) {
      celebrationShownRef.current = true;
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
    if (completedToday < totalHabits) {
      celebrationShownRef.current = false;
    }
  }, [completedToday, totalHabits]);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i);
    if (day <= 0) return { day: '', progress: 0 };
    const completedCount = habits.filter(h => h.completedDays.includes(day)).length;
    return {
      day: getDayName(day),
      progress: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0,
    };
  });

  const toggleDay = (habitId: string, day: number) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === habitId) {
          const isCurrentlyCompleted = h.completedDays.includes(day);
          const completedDays = isCurrentlyCompleted
            ? h.completedDays.filter(d => d !== day)
            : [...h.completedDays, day];
          let newStreak = h.streak;
          if (!isCurrentlyCompleted) newStreak++;
          else if (newStreak > 0) newStreak--;
          return { ...h, completedDays, streak: newStreak };
        }
        return h;
      });
      onHabitsChange?.(updated);
      return updated;
    });
  };

  const handleEditSave = (updated: Habit) => {
    const newHabits = habits.map(h => h.id === updated.id ? updated : h);
    setHabits(newHabits);
    onEditHabit?.(updated);
    onHabitsChange?.(newHabits);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIdx) return;
    const reordered = [...habits];
    const [item] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIdx, 0, item);
    setDragIndex(targetIdx);
    setHabits(reordered);
    onHabitsChange?.(reordered);
  };

  const usedCategories = Array.from(new Set(habits.map(h => h.category).filter(Boolean))) as HabitCategory[];
  const showCategoryFilter = usedCategories.length > 1;

  const filteredHabits = activeCategory === 'tümü'
    ? habits
    : habits.filter(h => h.category === activeCategory);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {showCelebration && (
        <div style={{
          position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 600, zIndex: 9999,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          animation: 'slideDown 0.4s ease',
          boxShadow: '0 8px 30px rgba(16,185,129,0.5)',
        }}>
          <span style={{ fontSize: '1.4rem' }}>🎉</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Harika! Bugün tüm hedeflerini tamamladın!</span>
          <span style={{ fontSize: '1.4rem' }}>🎉</span>
        </div>
      )}

      {/* Daily Quote */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.1))',
        border: '1px solid rgba(14,165,233,0.2)',
        borderRadius: 16, padding: '14px 18px',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic' }}>
          {todayQuote}
        </p>
      </div>

      <section>
        <h3 className="mobile-card-title">Momentum</h3>
        <div className="momentum-grid">
          <CircularProgress value={continuity} label="Süreklilik" color="var(--accent-blue)" size={80} />
          <CircularProgress value={dailyProgress} label="Günlük" color="var(--accent-green)" size={80} />
          <CircularProgress value={weeklyProgress} label="Haftalık" color="var(--accent-yellow)" size={80} />
          <CircularProgress value={monthlyProgress} label="Aylık" color="var(--accent-purple)" size={80} />
        </div>
      </section>

      <div className="mobile-card">
        <h3 className="mobile-card-title">Haftalık Performans</h3>
        <div style={{ height: '150px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <Line type="monotone" dataKey="progress" stroke="var(--accent-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-green)' }} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="var(--text-dim)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }}
                itemStyle={{ color: 'var(--text-main)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 className="mobile-card-title" style={{ margin: 0 }}>Bugünkü Hedefler</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}
          >
            {showHistory ? 'Günü Göster' : 'Tüm Ay'} <ChevronRight size={14} />
          </button>
        </div>

        {showCategoryFilter && !showHistory && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 4 }}>
            <button
              onClick={() => setActiveCategory('tümü')}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                border: activeCategory === 'tümü' ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                background: activeCategory === 'tümü' ? 'rgba(14,165,233,0.15)' : 'var(--surface-alt)',
                color: activeCategory === 'tümü' ? 'var(--accent-blue)' : 'var(--text-dim)',
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              }}
            >
              Tümü
            </button>
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                  border: activeCategory === cat ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
                  background: activeCategory === cat ? 'rgba(14,165,233,0.15)' : 'var(--surface-alt)',
                  color: activeCategory === cat ? 'var(--accent-blue)' : 'var(--text-dim)',
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        )}

        {!showHistory ? (
          <div className="habit-list">
            {filteredHabits.map(habit => {
              const checked = habit.completedDays.includes(today);
              const weeklyCount = habit.completedDays.filter(d => last7Days.includes(d)).length;
              const weeklyTarget = habit.targetDaysPerWeek ?? 7;
              const habitIdx = habits.indexOf(habit);
              return (
                <div
                  key={habit.id}
                  className="habit-list-item"
                  style={{
                    cursor: 'default',
                    opacity: dragIndex !== null && dragIndex !== habitIdx ? 0.6 : 1,
                    transition: 'opacity 0.15s ease',
                  }}
                  draggable={activeCategory === 'tümü'}
                  onDragStart={() => setDragIndex(habitIdx)}
                  onDragOver={(e) => handleDragOver(e, habitIdx)}
                  onDragEnd={() => setDragIndex(null)}
                >
                  {activeCategory === 'tümü' && (
                    <GripVertical size={14} color="var(--text-dim)" style={{ cursor: 'grab', flexShrink: 0 }} />
                  )}
                  <div
                    className={`habit-checkbox ${checked ? 'checked' : ''}`}
                    style={checked ? { background: habit.color, cursor: 'pointer' } : { cursor: 'pointer' }}
                    onClick={() => toggleDay(habit.id, today)}
                  >
                    {checked && <Check size={18} color="white" />}
                  </div>
                  <div className="habit-info" style={{ flex: 1 }} onClick={() => setSelectedHabit(habit)}>
                    <div className="habit-name">{habit.name}</div>
                    <div className="habit-streak-badge">
                      <Flame size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      {weeklyCount}/{weeklyTarget} Bu Hafta
                      {habit.category && (
                        <span style={{ marginLeft: 6, opacity: 0.7 }}>· {CATEGORY_LABELS[habit.category]}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHabit(habit)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
                  >
                    <Info size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mobile-card history-table-container">
            <h3 className="mobile-card-title">{now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })} Geçmişi</h3>
            <table className="habit-table">
              <thead>
                <tr>
                  <th className="habit-row-name" style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>ALIŞKANLIK</th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th key={i} className="day-header">{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit.id}>
                    <td className="habit-row-name" style={{ fontSize: '0.7rem', minWidth: '100px' }}>{habit.name}</td>
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const isCompleted = habit.completedDays.includes(day);
                      return (
                        <td key={i}>
                          <div
                            className={`day-cell ${isCompleted ? 'completed' : ''}`}
                            style={{ width: '20px', height: '20px', backgroundColor: isCompleted ? habit.color : 'rgba(255,255,255,0.03)' }}
                            onClick={() => toggleDay(habit.id, day)}
                          >
                            {isCompleted && <Check size={8} />}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedHabit && (
        <HabitDetailModal
          habit={selectedHabit}
          onClose={() => setSelectedHabit(null)}
          onEdit={() => {
            setEditingHabit(selectedHabit);
            setSelectedHabit(null);
          }}
          onDelete={onDeleteHabit ? () => {
            onDeleteHabit(selectedHabit.id);
            setSelectedHabit(null);
          } : undefined}
        />
      )}

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

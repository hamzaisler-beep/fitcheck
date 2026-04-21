import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Habit, HabitCategory } from '../types';
import { CATEGORY_LABELS } from '../types';

const COLORS = [
  '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#3b82f6', '#f97316',
];

const CATEGORIES = Object.keys(CATEGORY_LABELS) as HabitCategory[];

interface Props {
  habit: Habit;
  onClose: () => void;
  onSave: (updated: Habit) => void;
}

export const EditHabitModal = ({ habit, onClose, onSave }: Props) => {
  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);
  const [category, setCategory] = useState<HabitCategory>(habit.category ?? 'diğer');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(habit.targetDaysPerWeek ?? 7);
  const [reminderTime, setReminderTime] = useState(habit.reminderTime ?? '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      ...habit,
      name: name.trim(),
      color,
      category,
      targetDaysPerWeek,
      reminderTime: reminderTime || undefined,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 4000,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 600,
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          padding: '28px 24px 40px',
          border: '1px solid var(--border)',
          animation: 'slideUp 0.3s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Alışkanlığı Düzenle</h3>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Alışkanlık adı</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                background: 'var(--surface-alt)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px', color: 'var(--text-main)',
                fontSize: '1rem', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Kategori</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '7px 12px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600,
                    border: category === cat ? `2px solid ${color}` : '2px solid var(--border)',
                    background: category === cat ? `${color}22` : 'var(--surface-alt)',
                    color: category === cat ? color : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Haftada kaç gün?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(d => (
                <button
                  key={d}
                  onClick={() => setTargetDaysPerWeek(d)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700,
                    border: targetDaysPerWeek === d ? `2px solid ${color}` : '2px solid var(--border)',
                    background: targetDaysPerWeek === d ? `${color}22` : 'var(--surface-alt)',
                    color: targetDaysPerWeek === d ? color : 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Hatırlatıcı saati <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}>(opsiyonel)</span>
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              style={{
                background: 'var(--surface-alt)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px', color: 'var(--text-main)',
                fontSize: '1rem', fontFamily: 'inherit', outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Renk</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', background: c,
                    border: color === c ? '3px solid white' : '3px solid transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: color === c ? `0 0 0 2px ${c}` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {color === c && <Check size={14} color="white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              marginTop: 8,
              background: name.trim() ? `linear-gradient(135deg, ${color}, ${color}aa)` : 'var(--surface-alt)',
              color: name.trim() ? 'white' : 'var(--text-dim)',
              border: 'none', borderRadius: 14, padding: '16px',
              fontSize: '1rem', fontWeight: 700, cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
            }}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

import { X, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import type { Habit } from '../types';

interface Props {
  habit: Habit;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const HabitDetailModal = ({ habit, onClose, onEdit, onDelete }: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const now = new Date();
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const completedThisMonth = habit.completedDays.filter(d => d <= today).length;
  const completionRate = today > 0 ? Math.round((completedThisMonth / today) * 100) : 0;

  const monthName = now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
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
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: habit.color, flexShrink: 0 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{habit.name}</h3>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: 'var(--accent-blue)', cursor: 'pointer' }}
              >
                <Pencil size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {[
            { value: habit.streak, label: 'Günlük Seri 🔥', color: habit.color },
            { value: `${completionRate}%`, label: 'Bu Ay Başarı', color: 'var(--accent-green)' },
            { value: completedThisMonth, label: 'Tamamlandı', color: 'var(--accent-yellow)' },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'var(--surface-alt)', borderRadius: 14, padding: '14px 10px',
              textAlign: 'center', border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mini Calendar */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {monthName}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700, paddingBottom: 4 }}>{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const isCompleted = habit.completedDays.includes(day);
            const isFuture = day > today;
            return (
              <div key={day} style={{
                aspectRatio: '1', borderRadius: 6,
                background: isCompleted ? habit.color : isFuture ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700,
                color: isCompleted ? 'white' : isFuture ? 'var(--text-dim)' : 'var(--text-muted)',
                border: day === today ? `2px solid ${habit.color}` : '2px solid transparent',
                opacity: isFuture ? 0.35 : 1,
              }}>{day}</div>
            );
          })}
        </div>

        {onDelete && (
          <div style={{ marginTop: 28 }}>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Trash2 size={16} /> Alışkanlığı Sil
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 12,
                    background: 'var(--surface-alt)', border: '1px solid var(--border)',
                    color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  }}
                >
                  İptal
                </button>
                <button
                  onClick={onDelete}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 12,
                    background: '#ef4444', border: 'none',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  }}
                >
                  Evet, Sil
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

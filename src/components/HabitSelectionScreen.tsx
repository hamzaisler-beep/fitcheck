import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import type { Habit } from '../types';

interface HabitSelectionScreenProps {
  onComplete: (selectedHabits: Habit[]) => void;
}

const RECOMMENDATIONS = [
  { id: 'r1', name: 'Güne Erken Başla', color: '#0ea5e9', description: 'Güne enerjik bir başlangıç yap.' },
  { id: 'r2', name: 'Su İçmeyi Unutma', color: '#3b82f6', description: 'Günde en az 2 litre su iç.' },
  { id: 'r3', name: 'Meditasyon Yap', color: '#10b981', description: 'Zihnini 10 dakika dinlendir.' },
  { id: 'r4', name: 'Kitap Oku', color: '#8b5cf6', description: 'Hergün 20 sayfa oku.' },
  { id: 'r5', name: 'Egzersiz Yap', color: '#f59e0b', description: 'Vücudunu harekete geçir.' },
  { id: 'r6', name: 'Yürüyüşe Çık', color: '#ec4899', description: 'Temiz hava al.' }
];

export const HabitSelectionScreen = ({ onComplete }: HabitSelectionScreenProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const selected = RECOMMENDATIONS
      .filter(r => selectedIds.includes(r.id))
      .map(r => ({
        id: r.id,
        name: r.name,
        color: r.color,
        target: 21,
        completedDays: [],
        streak: 0
      }));
    onComplete(selected);
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <h1>Alışkanlıklarını Seç</h1>
        <p>Senin için önerdiğimiz rutinlerden başla.</p>
      </div>

      <div className="habit-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '40px' }}>
        {RECOMMENDATIONS.map(habit => {
          const isSelected = selectedIds.includes(habit.id);
          return (
            <div 
              key={habit.id} 
              className={`mobile-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSelect(habit.id)}
              style={{ 
                cursor: 'pointer', 
                border: isSelected ? `2px solid ${habit.color}` : '1px solid var(--border)',
                background: isSelected ? `${habit.color}10` : 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '15px'
              }}
            >
              <div style={{ 
                width: 40, height: 40, borderRadius: '12px', background: habit.color, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
                color: 'white'
              }}>
                {isSelected ? <Check size={20} /> : <Plus size={20} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 5 }}>{habit.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{habit.description}</div>
            </div>
          );
        })}
      </div>

      <button 
        className="primary-button full-width" 
        onClick={handleFinish}
        disabled={selectedIds.length === 0}
        style={{ opacity: selectedIds.length === 0 ? 0.5 : 1 }}
      >
        {selectedIds.length > 0 ? `${selectedIds.length} Alışkanlık ile Başla` : 'Seçim Yapın'}
      </button>
    </div>
  );
};

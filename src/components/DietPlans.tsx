import React from 'react';
import { Coffee, Apple, Moon, Plus, ChevronRight } from 'lucide-react';
import { auth } from '../lib/firebase';

interface DietPlansProps {
  userData?: any;
}

const DietPlans: React.FC<DietPlansProps> = ({ userData }) => {
  const displayName = auth.currentUser?.displayName?.split(' ')[0] || userData?.name || 'Kullanıcı';
  
  const meals = userData?.dietPlan?.meals || [];
  
  if (meals.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', marginBottom: '16px' }}>
          <Apple size={40} />
        </div>
        <h2 style={{ fontSize: '24px' }}>Beslenme Programın Henüz Yok</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}>
          Hedeflerine uygun bir beslenme programı oluşturmak için AI asistanımızla konuşabilirsin.
        </p>
        <button 
          className="btn-primary" 
          style={{ marginTop: '12px' }}
          onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'chat' }))}
        >
          AI ile Program Oluştur
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '28px' }}>Beslenme Programın</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Diyetisyen Melis tarafından {displayName} için hazırlandı.</p>
      </header>

      <section style={{ display: 'flex', gap: '16px' }}>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Günlük Hedef</p>
            <h4 style={{ fontSize: '18px' }}>{userData?.dietPlan?.targetKcal || 0} <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Alınan</p>
            <h4 style={{ fontSize: '18px' }}>0 <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kalan</p>
            <h4 style={{ fontSize: '18px', color: 'var(--accent-secondary)' }}>{userData?.dietPlan?.targetKcal || 0} <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {meals.map((meal: any) => (
          <div key={meal.id} className="glass-card" style={{ 
            padding: '20px', 
            opacity: meal.status === 'completed' ? 0.7 : 1,
            borderLeft: meal.status === 'current' ? '4px solid var(--accent-secondary)' : 'none'
          }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '14px', 
                background: 'var(--surface-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: meal.status === 'current' ? 'var(--accent-secondary)' : 'var(--text-secondary)'
              }}>
                {meal.type === 'Kahvaltı' ? <Coffee /> : meal.type === 'Akşam Yemeği' ? <Moon /> : <Apple />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{meal.type} • {meal.time}</span>
                    <h4 style={{ fontSize: '17px', margin: '2px 0' }}>{meal.title}</h4>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{meal.kcal} kcal</span>
                </div>
                
                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {meal.items.map((item: string) => (
                    <span key={item} style={{ 
                      fontSize: '11px', 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '4px 10px', 
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)'
                    }}>{item}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ChevronRight size={18} color="var(--text-secondary)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietPlans;

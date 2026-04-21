import React from 'react';
import { Utensils, Coffee, Apple, Moon, Plus, ChevronRight } from 'lucide-react';
import { auth } from '../lib/firebase';

interface DietPlansProps {
  userData?: any;
}

const DietPlans: React.FC<DietPlansProps> = ({ userData }) => {
  const displayName = auth.currentUser?.displayName?.split(' ')[0] || userData?.name || 'Kullanıcı';
  
  const meals = [
    { id: 1, type: "Kahvaltı", icon: <Coffee />, title: "Yulaflı & Meyveli Kase", kcal: "320", time: "08:30", items: ["40g Yulaf", "1 adet Muz", "10 adet Çiğ Badem"], status: 'completed' },
    { id: 2, type: "Öğle Yemeği", icon: <Apple />, title: "Izgara Tavuklu Salata", kcal: "450", time: "13:00", items: ["150g Tavuk Göğsü", "Akdeniz Yeşilliği", "1 Dilim Tam Buğday Ekmek"], status: 'current' },
    { id: 3, type: "Ara Öğün", icon: <Plus />, title: "Protein Bar / Yeşil Çay", kcal: "180", time: "16:30", items: ["Fıstık Ezmeli Bar"], status: 'pending' },
    { id: 4, type: "Akşam Yemeği", icon: <Moon />, title: "Fırın Levrek & Sebze", kcal: "400", time: "19:30", items: ["1 orta boy Levrek", "Buharda Pişmiş Brokoli"], status: 'pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '28px' }}>Beslenme Programın</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Diyetisyen Melis tarafından {displayName} için hazırlandı.</p>
      </header>

      <section style={{ display: 'flex', gap: '16px' }}>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Günlük Hedef</p>
            <h4 style={{ fontSize: '18px' }}>1,850 <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Alınan</p>
            <h4 style={{ fontSize: '18px' }}>770 <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
         <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kalan</p>
            <h4 style={{ fontSize: '18px', color: 'var(--accent-secondary)' }}>1,080 <span style={{ fontSize: '12px' }}>kcal</span></h4>
         </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {meals.map((meal) => (
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
                {meal.icon}
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
                  {meal.items.map(item => (
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

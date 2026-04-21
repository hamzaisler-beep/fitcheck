import React from 'react';
import { Activity, Flame, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { auth } from '../lib/firebase';

interface DashboardProps {
  userData?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const [water, setWater] = React.useState(0);
  const targetWater = 3.0;
  const waterPercentage = (water / targetWater) * 213;

  const displayName = auth.currentUser?.displayName?.split(' ')[0] || userData?.name || 'Kullanıcı';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Hoş geldin, {displayName} 👋</p>
        <h2 style={{ fontSize: '28px', marginTop: '4px' }}>Bugün yeni bir başlangıç!</h2>
      </header>

      {/* Streak Tracker */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="glass-card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255, 61, 0, 0.1)', color: 'var(--accent-tertiary)' }}>
            <Flame size={20} fill="var(--accent-tertiary)" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Seri</p>
            <h4 style={{ fontSize: '16px' }}>0 Gün</h4>
          </div>
        </div>
        <div className="glass-card" style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-secondary)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Puan</p>
            <h4 style={{ fontSize: '16px' }}>0</h4>
          </div>
        </div>
      </div>

      {/* Daily Progress Rings */}
      <div className="glass-card" style={{ 
        padding: '24px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px',
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '70px', height: '70px' }}>
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="var(--accent-primary)" strokeWidth="8" fill="none" 
                      strokeDasharray="213" strokeDashoffset="213" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} color="var(--accent-primary)" />
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>0 kcal</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '70px', height: '70px' }}>
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="var(--accent-secondary)" strokeWidth="8" fill="none" 
                      strokeDasharray="213" strokeDashoffset="213" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--accent-secondary)" />
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>0 dk Spor</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setWater(prev => Math.min(prev + 0.25, targetWater))}
            style={{ position: 'relative', width: '70px', height: '70px', padding: 0, background: 'none', border: 'none' }}
          >
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle cx="40" cy="40" r="34" stroke="var(--accent-tertiary)" strokeWidth="8" fill="none" 
                      strokeDasharray="213" strokeDashoffset={213 - waterPercentage} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} color="var(--accent-tertiary)" />
            </div>
          </button>
          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{water.toFixed(1)} / {targetWater}L</span>
        </div>
      </div>

      <div className="glass-card" style={{ 
        padding: '20px', 
        borderLeft: '4px solid var(--accent-primary)',
        background: 'linear-gradient(90deg, rgba(204, 255, 0, 0.05), transparent)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
             <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Coach" alt="Coach" style={{ width: '30px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>AI Koç Mesajı</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              "Hoş geldin! Profil bilgilerine göre senin için en uygun antrenman ve beslenme planını hazırladım. Başlamaya hazır mısın?"
            </p>
          </div>
        </div>
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Sıradaki Öğün</h3>
          <button style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none' }}>Tümünü Gör</button>
        </div>
        <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Bugün için henüz öğün eklenmedi.</p>
            <button style={{ color: 'var(--accent-primary)', fontSize: '13px', marginTop: '8px', background: 'none', border: 'none', fontWeight: 'bold' }}>Hemen Ekle +</button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;

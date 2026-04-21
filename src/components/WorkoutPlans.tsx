import React from 'react';
import { Play, Clock, Flame, CheckCircle2, ArrowLeft } from 'lucide-react';
import { auth } from '../lib/firebase';

interface WorkoutPlansProps {
  userData?: any;
}

const WorkoutPlans: React.FC<WorkoutPlansProps> = ({ userData }) => {
  const [activeSession, setActiveSession] = React.useState<any>(null);
  const displayName = auth.currentUser?.displayName?.split(' ')[0] || userData?.name || 'Kullanıcı';
  
  const workouts = [
    { id: 1, title: "Alt Vücut & Core", time: "45 dk", kcal: "350", intensity: "Orta", status: "Yapıldı", color: "#ccff00", exercises: [
      { name: "Squat", sets: "4", reps: "12" },
      { name: "Lunges", sets: "3", reps: "15" },
      { name: "Plank", sets: "3", reps: "60sn" }
    ]},
    { id: 2, title: "HIIT - Yağ Yakımı", time: "25 dk", kcal: "420", intensity: "Yüksek", status: "Bugün", color: "#ff3d00", exercises: [
      { name: "Burpees", sets: "4", reps: "20" },
      { name: "Mountain Climbers", sets: "4", reps: "30sn" },
      { name: "Jump Squats", sets: "3", reps: "15" }
    ]},
    { id: 3, title: "Üst Vücut Güç", time: "50 dk", kcal: "300", intensity: "Orta", status: "Yarın", color: "#00f2ff", exercises: [
      { name: "Push Ups", sets: "4", reps: "Max" },
      { name: "Dumbbell Press", sets: "4", reps: "10" }
    ]},
  ];

  if (activeSession) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button 
          onClick={() => setActiveSession(null)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', background: 'none', border: 'none' }}
        >
          <ArrowLeft size={20} /> Antrenmanlara Dön
        </button>
        
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: activeSession.color }}></div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{activeSession.title}</h2>
          <div style={{ fontSize: '40px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)', margin: '16px 0' }}>
            14:22
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Antrenman Süresi</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeSession.exercises.map((ex: any, i: number) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '16px' }}>{ex.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{ex.sets} Set × {ex.reps}</p>
              </div>
              <button style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                border: 'none'
              }}>
                <CheckCircle2 size={22} />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          className="btn-primary" 
          style={{ height: '56px', marginTop: '10px', boxShadow: `0 10px 20px rgba(204, 255, 0, 0.2)` }} 
          onClick={() => setActiveSession(null)}
        >
          Antrenmanı Tamamla
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header>
        <h2 style={{ fontSize: '28px' }}>Antrenman Programın</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Antrenör Murat tarafından {displayName} için özel hazırlandı.</p>
      </header>

      <section>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
           {['Hepsi', 'Güç', 'HIIT', 'Kardiyo'].map((cat, i) => (
             <button key={cat} style={{
               padding: '10px 20px',
               borderRadius: '12px',
               background: i === 0 ? 'var(--accent-primary)' : 'var(--surface-color)',
               color: i === 0 ? '#000' : 'var(--text-secondary)',
               whiteSpace: 'nowrap',
               fontWeight: '700',
               fontSize: '13px',
               border: 'none'
             }}>{cat}</button>
           ))}
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {workouts.map((ws) => (
          <div 
            key={ws.id} 
            className="glass-card" 
            onClick={() => setActiveSession(ws)}
            style={{ padding: '20px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: ws.color }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: ws.color, textTransform: 'uppercase' }}>{ws.status}</span>
                <h4 style={{ fontSize: '18px', margin: '4px 0' }}>{ws.title}</h4>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <Clock size={14} /> {ws.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <Flame size={14} /> {ws.kcal} kcal
                  </div>
                </div>
              </div>
              <button style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '14px', 
                background: ws.status === 'Yapıldı' ? 'rgba(74, 222, 128, 0.1)' : 'var(--surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: ws.status === 'Yapıldı' ? '#4ade80' : 'var(--text-primary)',
                border: 'none'
              }}>
                {ws.status === 'Yapıldı' ? <CheckCircle2 size={24} /> : <Play size={20} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlans;

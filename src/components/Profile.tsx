import React from 'react';
import { User, Settings, FileText, Scale, Ruler, ChevronRight, Upload, TrendingUp, Info, LogOut } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const weightData = [
  { name: 'Pzt', weight: 80.5 },
  { name: 'Sal', weight: 80.2 },
  { name: 'Çar', weight: 79.8 },
  { name: 'Per', weight: 79.5 },
  { name: 'Cum', weight: 79.0 },
  { name: 'Cmt', weight: 78.8 },
  { name: 'Paz', weight: 78.5 },
];

interface ProfileProps {
  userData?: any;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const [hasReport, setHasReport] = React.useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
         <div style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '28px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '3px'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '26px', 
              background: '#1a1a1c',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.email || 'Felix'}`} alt="Profile" style={{ width: '80%' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '22px' }}>{auth.currentUser?.displayName || 'Hamza İşler'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{auth.currentUser?.email}</p>
          </div>
      </header>

      {/* Progress Chart */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
           <h3 style={{ fontSize: '18px' }}>Kilo Değişimi</h3>
           <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 'bold' }}>-2 kg (Bu Hafta)</span>
        </div>
        <div className="glass-card" style={{ padding: '20px 20px 10px 10px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                itemStyle={{ color: 'var(--accent-primary)' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="var(--accent-primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Body Measurements & AI Analysis */}
      <section>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Sağlık Karnesi (AI Analizi)</h3>
        {!hasReport ? (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderStyle: 'dashed' }}>
             <Upload size={32} style={{ margin: '0 auto 12px', color: 'var(--text-secondary)' }} />
             <h4 style={{ fontSize: '15px' }}>Check-up veya PDF Yükle</h4>
             <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '16px' }}>
               Raporunu yükle, AI senin için tahlillerini analiz etsin.
             </p>
             <button className="btn-primary" style={{ width: '100%', height: '48px', fontSize: '14px' }} onClick={() => setHasReport(true)}>
               Belge Yükle
             </button>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Vücut Yağı</p>
                <h4 style={{ fontSize: '16px', color: 'var(--accent-primary)' }}>%18.2</h4>
             </div>
             <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Kas Kütlesi</p>
                <h4 style={{ fontSize: '16px', color: 'var(--accent-secondary)' }}>34.5 kg</h4>
             </div>
             <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>VKI (BMI)</p>
                <h4 style={{ fontSize: '16px' }}>23.4</h4>
             </div>
             <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Metabolizma</p>
                <h4 style={{ fontSize: '16px' }}>1850 kcal</h4>
             </div>
             <button style={{ gridColumn: 'span 2', marginTop: '8px', fontSize: '13px', color: 'var(--accent-primary)', fontWeight: '600' }} onClick={() => setHasReport(false)}>
               Yeni Rapor Yükle
             </button>
          </div>
        )}
      </section>

      {/* Body Measurements */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px' }}>Vücut Ölçüleri</h3>
          <button style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '600' }}>Güncelle</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(204, 255, 0, 0.1)', color: 'var(--accent-primary)' }}>
               <Scale size={20} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Kilo</p>
              <h4 style={{ fontSize: '18px' }}>{userData?.weight || '75'} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>kg</span></h4>
            </div>
          </div>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-secondary)' }}>
               <Ruler size={20} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Boy</p>
              <h4 style={{ fontSize: '18px' }}>{userData?.height || '180'} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>cm</span></h4>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Settings */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <MenuItem icon={<Settings size={20} />} label="Uygulama Ayarları" />
        <MenuItem icon={<FileText size={20} />} label="Haftalık Raporlar" />
        <MenuItem icon={<TrendingUp size={20} />} label="Başarımlar" badge="4" />
        <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
          <MenuItem icon={<LogOut size={20} color="var(--accent-tertiary)" />} label="Güvenli Çıkış Yap" />
        </button>
      </section>
    </div>
  );
};

const MenuItem = ({ icon, label, badge }: any) => (
  <div className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
      <span style={{ fontSize: '15px' }}>{label}</span>
    </div>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {badge && <span style={{ padding: '2px 8px', background: 'var(--accent-tertiary)', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{badge}</span>}
      <ChevronRight size={18} color="var(--text-secondary)" />
    </div>
  </div>
);

export default Profile;

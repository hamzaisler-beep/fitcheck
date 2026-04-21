import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CircularProgress } from './CircularProgress';
import { TrendingUp, Target, Share2 } from 'lucide-react';
import { useState } from 'react';
import type { Habit } from '../types';

interface YearlyDashboardProps {
  habits: Habit[];
}

export const YearlyDashboard = ({ habits }: YearlyDashboardProps) => {
  const [copied, setCopied] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11
  const today = now.getDate();

  const totalCompleted = habits.reduce((acc, h) => acc + h.completedDays.length, 0);
  const yearlyTarget = habits.length * 365;
  const yearlyProgress = yearlyTarget > 0 ? Math.round((totalCompleted / yearlyTarget) * 100) : 0;

  // Days passed this year
  const startOfYear = new Date(currentYear, 0, 1);
  const daysPassed = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalPossible = habits.length * daysPassed;
  const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // Quarter progress (current quarter months only)
  // quarter target = 3 months × 30 days × habits
  const quarterTarget = habits.length * 90;
  const quarterProgress = quarterTarget > 0 ? Math.min(100, Math.round((totalCompleted / quarterTarget) * 100)) : 0;

  // Monthly chart — current month has real data, others 0
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const chartData = monthNames.map((m, i) => ({
    name: m,
    completed: i === currentMonthIndex ? totalCompleted : 0,
    target: habits.length * 30,
  }));

  const currentMonthName = now.toLocaleString('tr-TR', { month: 'long' });

  const handleShare = async () => {
    const text = `Flowbit ${currentYear} İstatistiklerim 🌱\n📊 Genel oran: %${overallRate}\n✅ Toplam: ${totalCompleted} gün tamamlandı\n🎯 Yıllık hedef: ${totalCompleted}/${yearlyTarget}\n📅 Yılın ${daysPassed}. gününde ${habits.length} aktif alışkanlık`;
    if (navigator.share) {
      await navigator.share({ title: 'Flowbit İstatistiklerim', text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="mobile-card-title" style={{ margin: 0 }}>Yıllık Özet ({currentYear})</h3>
          <button
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)',
              borderRadius: 10, padding: '7px 12px', color: 'var(--accent-blue)',
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            <Share2 size={14} /> {copied ? 'Kopyalandı!' : 'Paylaş'}
          </button>
        </div>
        <div className="momentum-grid">
          <CircularProgress value={overallRate} label="Genel Oran" color="var(--accent-blue)" size={80} />
          <CircularProgress value={yearlyProgress} label="Yıllık" color="var(--accent-green)" size={80} />
          <CircularProgress value={quarterProgress} label="Çeyrek" color="var(--accent-yellow)" size={80} />
          <CircularProgress value={Math.min(100, totalCompleted)} label="Toplam" color="var(--accent-purple)" size={80} />
        </div>
      </section>

      <div className="mobile-card">
        <h3 className="mobile-card-title">Yıllık Trend</h3>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                formatter={(value) => [`${value} gün`, 'Tamamlanan']}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed > 0 ? 'var(--accent-green)' : 'rgba(255,255,255,0.08)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: 8 }}>
          Geçmiş ay verileri biriktikçe grafik dolacak
        </p>
      </div>

      <section>
        <h3 className="mobile-card-title">Başarılarım</h3>
        <div className="mobile-card" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <TrendingUp color="var(--accent-green)" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Bu Ay: {currentMonthName}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {totalCompleted} gün tamamlandı · %{overallRate} oran
            </div>
          </div>
        </div>
        <div className="mobile-card" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Target color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Yıllık Hedef: {yearlyTarget}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Tamamlanan: {totalCompleted} · Kalan: {Math.max(0, yearlyTarget - totalCompleted)}
            </div>
          </div>
        </div>
        <div className="mobile-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '1.3rem' }}>📅</span>
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>Yılın {daysPassed}. Günü</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {today} Nisan {currentYear} · {habits.length} aktif alışkanlık
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

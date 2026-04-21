import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

interface OnboardingScreenProps {
  onNext: () => void;
}

export const OnboardingScreen = ({ onNext }: OnboardingScreenProps) => {
  return (
    <div className="auth-container animate-fade-in" style={{ justifyContent: 'center', textAlign: 'center' }}>
      <div className="onboarding-content">
        <div className="auth-logo" style={{ background: 'var(--grad-purple)', width: 80, height: 80, fontSize: '3rem', marginBottom: 30 }}>
          🚀
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: 20, lineHeight: 1.2 }}>Yeni Bir Başlangıca Hazır Mısın?</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: 40, padding: '0 20px' }}>
          Habit Tracker ile hayatını disipline et, hedeflerine adım adım yaklaş. Senin için en uygun alışkanlıkları seçerek başlayalım.
        </p>

        <div className="features-grid" style={{ display: 'grid', gap: '20px', marginBottom: 40, textAlign: 'left' }}>
          <div className="feature-item animate-slide-up" style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'var(--surface)', padding: '15px', borderRadius: '15px', border: '1px solid var(--border)', animationDelay: '0.1s' }}>
            <div style={{ color: 'var(--accent-yellow)' }}><Sparkles /></div>
            <div>
              <div style={{ fontWeight: 700 }}>Kişiselleştirilmiş Öneriler</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Sana en uygun rutinleri keşfet.</div>
            </div>
          </div>
          <div className="feature-item animate-slide-up" style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'var(--surface)', padding: '15px', borderRadius: '15px', border: '1px solid var(--border)', animationDelay: '0.2s' }}>
            <div style={{ color: 'var(--accent-blue)' }}><Target /></div>
            <div>
              <div style={{ fontWeight: 700 }}>İlerleme Takibi</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Detaylı grafiklerle gelişimini izle.</div>
            </div>
          </div>
          <div className="feature-item animate-slide-up" style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'var(--surface)', padding: '15px', borderRadius: '15px', border: '1px solid var(--border)', animationDelay: '0.3s' }}>
            <div style={{ color: 'var(--accent-green)' }}><Zap /></div>
            <div>
              <div style={{ fontWeight: 700 }}>Motivasyon Aracı</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Seriler oluştur ve madalyalar kazan.</div>
            </div>
          </div>
        </div>

        <button className="primary-button full-width animate-slide-up" onClick={onNext} style={{ padding: '20px', animationDelay: '0.4s' }}>
          Hadi Başlayalım <ArrowRight />
        </button>
      </div>
    </div>
  );
};

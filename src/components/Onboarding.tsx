import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Target, Zap, Heart, ArrowLeft } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    goal: '',
    activity: '',
    weight: '75',
    height: '180',
    age: '25'
  });

  const handleFinish = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    setError('');
    
    const onboardingData = {
      ...formData,
      isOnboarded: true,
      updatedAt: Date.now()
    };

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, onboardingData, { merge: true });
      
      // Fetch latest data to ensure state is consistent
      const freshDoc = await getDoc(userRef);
      onComplete(freshDoc.data() || onboardingData);
    } catch (err: any) {
      console.error("Firestore Error details:", err);
      setError('Veritabanı bağlantı hatası. İnternet bağlantını kontrol et veya tekrar dene.');
      // Don't call onComplete here to prevent the "always shows" loop
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const goals = [
    { id: 'lose', title: 'Kilo Vermek', desc: 'Yağ yakın ve formda kalın', icon: <Zap size={24} />, color: 'var(--accent-tertiary)' },
    { id: 'muscle', title: 'Kas Yapmak', desc: 'Güçlenin ve kütle kazanın', icon: <Target size={24} />, color: 'var(--accent-primary)' },
    { id: 'health', title: 'Sağlıklı Yaşam', desc: 'Enerjinizi ve sağlığınızı koruyun', icon: <Heart size={24} />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'var(--bg-color)', 
      zIndex: 2000, 
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', minHeight: '4px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ 
            flex: 1, 
            height: '4px', 
            borderRadius: '2px', 
            background: i <= step ? 'var(--accent-primary)' : 'var(--surface-hover)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ flex: 1 }}
          >
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Hedefin ne?</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Sana özel planı hazırlayabilmemiz için bir hedef seçmelisin.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {goals.map(g => (
                <button 
                  key={g.id}
                  onClick={() => { setFormData({...formData, goal: g.id}); nextStep(); }}
                  className="glass-card"
                  style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    textAlign: 'left',
                    background: 'none',
                    border: formData.goal === g.id ? `2px solid ${g.color}` : '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '14px', 
                    background: 'var(--surface-color)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: g.color
                  }}>
                    {g.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '17px', color: '#fff' }}>{g.title}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{g.desc}</p>
                  </div>
                  <ChevronRight size={20} color="var(--text-secondary)" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ flex: 1 }}
          >
            <button onClick={prevStep} style={{ color: 'var(--text-secondary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none' }}>
              <ArrowLeft size={18} /> Geri
            </button>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Vücut ölçülerin?</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Kalori ihtiyacını tam hesaplamak için bu veriler kritik.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <InputGroup label="Mevcut Kilo (kg)" value={formData.weight} onChange={(v) => setFormData({...formData, weight: v})} />
              <InputGroup label="Boyun (cm)" value={formData.height} onChange={(v) => setFormData({...formData, height: v})} />
              <InputGroup label="Yaşın" value={formData.age} onChange={(v) => setFormData({...formData, age: v})} />
            </div>

            <button 
              className="btn-primary" 
              onClick={nextStep}
              style={{ width: '100%', marginTop: '40px', height: '56px' }}
            >
              Devam Et
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
          >
            <div style={{ 
              width: '120px', 
              height: '120px', 
              background: 'var(--accent-primary)', 
              borderRadius: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              boxShadow: '0 20px 40px rgba(204, 255, 0, 0.3)'
            }}>
              <Zap size={60} color="#000" />
            </div>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Her Şey Hazır!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '280px' }}>
               AI koçların senin için en uygun programı oluşturdu. Değişime hazır mısın?
            </p>

            {error && <p style={{ color: 'var(--accent-tertiary)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>}
            
            <button 
              className="btn-primary" 
              onClick={handleFinish}
              disabled={isSaving}
              style={{ width: '100%', height: '56px' }}
            >
              {isSaving ? 'Hazırlanıyor...' : 'Uygulamaya Gir'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>{label}</label>
    <input 
      type="number" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ 
        background: 'var(--surface-color)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '16px', 
        padding: '16px', 
        fontSize: '20px', 
        color: '#fff',
        fontWeight: '700',
        outline: 'none'
      }} 
    />
  </div>
);

export default Onboarding;

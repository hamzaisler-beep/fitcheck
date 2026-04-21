import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, LogIn, ArrowRight, User, Calendar, ArrowLeft } from 'lucide-react';

const Auth: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(userCredential.user, {
          displayName: `${formData.name} ${formData.surname}`.trim()
        });
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          surname: formData.surname,
          birthDate: formData.birthDate,
          email: formData.email,
          createdAt: new Date(),
          isOnboarded: false
        });
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code);
      switch (err.code) {
        case 'auth/email-already-in-use': setError('Bu e-posta zaten kullanımda.'); break;
        case 'auth/weak-password': setError('Şifre en az 6 karakter olmalı.'); break;
        case 'auth/invalid-credential': setError('E-posta veya şifre hatalı.'); break;
        default: setError('Bir sorun oluştu: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            style={{ width: '100%' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div className="auth-icon-container">
                <Activity size={32} color="#000" />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Tekrar <span className="gradient-text">Selam!</span></h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>FitCheck dünyasına geri dön.</p>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input name="email" type="email" placeholder="E-posta" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input name="password" type="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required style={inputStyle} />
              </div>
              
              {error && <p className="error-text">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary" style={{ height: '56px' }}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'} <ArrowRight size={20} />
              </button>
            </form>

            <div className="divider"><span>veya</span></div>

            <button onClick={handleGoogle} className="glass-card google-btn">
              <LogIn size={20} /> Google ile Giriş Yap
            </button>

            <button onClick={() => setView('register')} style={{ marginTop: '32px', width: '100%', color: 'var(--text-secondary)', fontSize: '15px', background: 'none', border: 'none' }}>
              Hesabın yok mu? <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Hemen Kayıt Ol</span>
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="register"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%' }}
          >
            <button onClick={() => setView('login')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px', background: 'none', border: 'none' }}>
              <ArrowLeft size={20} /> Geri Dön
            </button>

            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800' }}>Yeni <span className="gradient-text">Hesap</span></h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Hedeflerine ulaşmak için ilk adımı at.</p>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input name="name" placeholder="Ad" value={formData.name} onChange={handleChange} required style={inputStyle} />
                </div>
                <div className="input-group">
                  <User size={18} className="input-icon" />
                  <input name="surname" placeholder="Soyad" value={formData.surname} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div className="input-group">
                <Calendar size={18} className="input-icon" />
                <input name="birthDate" type="date" placeholder="Doğum Tarihi" value={formData.birthDate} onChange={handleChange} required style={inputStyle} />
              </div>

              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input name="email" type="email" placeholder="E-posta" value={formData.email} onChange={handleChange} required style={inputStyle} />
              </div>

              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input name="password" type="password" placeholder="Şifre" value={formData.password} onChange={handleChange} required style={inputStyle} />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary" style={{ height: '56px', marginTop: '8px' }}>
                {loading ? 'Hesap oluşturuluyor...' : 'Hemen Kayıt Ol'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .auth-page { min-height: 100vh; padding: 24px; display: flex; flex-direction: column; justify-content: center; background: var(--bg-color); }
        .auth-icon-container { width: 70px; height: 70px; background: var(--accent-primary); border-radius: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 12px 24px rgba(204, 255, 0, 0.3); }
        .input-group { position: relative; width: 100%; }
        .input-icon { position: absolute; left: 16px; top: 18px; color: var(--text-secondary); pointer-events: none; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; color: var(--text-secondary); font-size: 13px; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--border-color); }
        .google-btn { width: 100%; height: 56px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 600; }
        .error-text { color: var(--accent-tertiary); font-size: 13px; text-align: center; background: rgba(255, 59, 48, 0.1); padding: 10px; border-radius: 12px; border: 1px solid rgba(255, 59, 48, 0.2); }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'var(--surface-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: '16px 16px 16px 48px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.2s ease shadow'
};

export default Auth;

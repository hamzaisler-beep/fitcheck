import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface RegisterScreenProps {
  onRegister: (uid: string, name: string) => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen = ({ onRegister, onNavigateToLogin }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) { setError('Tüm alanları doldur.'); return; }
    if (password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return; }
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        createdAt: Date.now(),
        score: 0,
        streak: 0,
      });
      onRegister(cred.user.uid, name);
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') setError('Bu e-posta zaten kullanılıyor.');
      else setError('Kayıt sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">🌱</div>
        </div>
        <h1>Yeni Hesap Oluştur</h1>
        <p>Hayatını alışkanlıklarla şekillendir.</p>
      </div>

      <div className="auth-form">
        <div className="input-group">
          <label>Ad Soyad</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input
              type="text"
              placeholder="Adınız Soyadınız"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>E-posta</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Şifre</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRegister()}
            />
          </div>
        </div>

        {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Kayıt olarak <span className="text-button small">Kullanım Koşulları</span>'nı kabul etmiş sayılırsınız.
        </div>

        <button type="button" className="primary-button full-width" onClick={handleRegister} disabled={loading}>
          {loading ? 'Kayıt yapılıyor...' : <> Hesap Oluştur <ArrowRight size={20} /> </>}
        </button>
      </div>

      <div className="auth-footer">
        Zaten hesabın var mı? <button className="text-button" onClick={onNavigateToLogin}>Giriş Yap</button>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', opacity: 0.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} /> Güvenli Kayıt İşlemi
        </div>
      </div>
    </div>
  );
};

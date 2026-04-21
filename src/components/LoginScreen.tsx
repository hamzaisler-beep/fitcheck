import { useState } from 'react';
import { Mail, Lock, ArrowRight, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LoginScreenProps {
  onLogin: (uid: string, name: string) => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen = ({ onLogin, onNavigateToRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      onLogin(cred.user.uid, cred.user.displayName || cred.user.email || 'Kullanıcı');
    } catch {
      setError('E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">✨</div>
        </div>
        <h1>Hoş Geldiniz!</h1>
        <p>Alışkanlıklarını takip etmeye devam et.</p>
      </div>

      <div className="auth-form">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Şifre</label>
          </div>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '4px' }}>
            <button type="button" className="text-button" style={{ fontSize: '0.8rem' }}>Şifremi Unuttum?</button>
          </div>
        </div>

        {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

        <button type="button" className="primary-button full-width" onClick={handleLogin} disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : <> Giriş Yap <ArrowRight size={20} /> </>}
        </button>
      </div>

      <div className="auth-divider"><span>veya</span></div>

      <button className="secondary-button full-width" onClick={() => onLogin('guest', 'Misafir')}>
        <LogIn size={20} /> Misafir Olarak Devam Et
      </button>

      <div className="auth-footer">
        Hesabın yok mu? <button className="text-button" onClick={onNavigateToRegister}>Hemen Kayıt Ol</button>
      </div>
    </div>
  );
};

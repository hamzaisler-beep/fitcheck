import React, { useState } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  User, 
  LayoutDashboard, 
  Activity,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './components/Dashboard';
import ChatSection from './components/ChatSection';
import WorkoutPlans from './components/WorkoutPlans';
import DietPlans from './components/DietPlans';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  React.useEffect(() => {
    // Fallback: If Firebase takes too long, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().isOnboarded) {
            setUserData(userDoc.data());
            setIsOnboarded(true);
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      clearTimeout(timer);
    });

    const handleSwitchTab = (e: any) => {
      setActiveTab(e.detail);
    };

    window.addEventListener('switchTab' as any, handleSwitchTab);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      window.removeEventListener('switchTab' as any, handleSwitchTab);
    };
  }, []);

  const handleOnboardingComplete = (fullData: any) => {
    console.log("Onboarding Complete:", fullData);
    setUserData(fullData);
    setIsOnboarded(true);
  };

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader" style={{ width: '30px', height: '30px', border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>;

  if (!user) return <Auth />;

  const renderContent = () => {
    if (!isOnboarded) return <Onboarding onComplete={handleOnboardingComplete} />;
    switch (activeTab) {
      case 'dashboard': return <Dashboard userData={userData} />;
      case 'chat': return <ChatSection />;
      case 'workout': return <WorkoutPlans userData={userData} />;
      case 'diet': return <DietPlans userData={userData} />;
      case 'profile': return <Profile userData={userData} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--bg-color)'
    }}>
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(12, 12, 14, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--accent-primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(204, 255, 0, 0.4)'
          }}>
            <Activity size={24} color="#000" />
          </div>
          <h1 style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>
            FIT<span className="gradient-text">AI</span>
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setShowNotification(!showNotification)}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--surface-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              position: 'relative'
            }}
          >
            <Bell size={20} />
          </button>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ccff00, #00f2ff)',
            padding: '2px'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              background: '#222',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: '16px 16px env(safe-area-inset-bottom, 100px) 16px',
        width: '100%',
        position: 'relative'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Bottom Navigation - Mobile Optimized */}
      <nav style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        left: '16px',
        right: '16px',
        height: '68px',
        background: 'rgba(26, 26, 28, 0.94)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '24px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        padding: '0 8px'
      }}>
        <TabButton 
          icon={<LayoutDashboard size={22} />} 
          isActive={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          label="Özet"
        />
        <TabButton 
          icon={<Dumbbell size={22} />} 
          isActive={activeTab === 'workout'} 
          onClick={() => setActiveTab('workout')} 
          label="Antrenman"
        />
        <TabButton 
          icon={<div style={{
            width: '54px',
            height: '54px',
            background: 'var(--accent-primary)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-36px',
            boxShadow: '0 8px 20px rgba(204, 255, 0, 0.35)',
            color: '#000',
            border: '4px solid var(--bg-color)'
          }}><MessageSquare size={26} /></div>} 
          isActive={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          isSpecial
        />
        <TabButton 
          icon={<Utensils size={22} />} 
          isActive={activeTab === 'diet'} 
          onClick={() => setActiveTab('diet')} 
          label="Beslenme"
        />
        <TabButton 
          icon={<User size={22} />} 
          isActive={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          label="Profil"
        />
      </nav>

      <style>{`
        .app-container {
          background-image: radial-gradient(circle at 50% -20%, rgba(204, 255, 0, 0.05) 0%, transparent 50%),
                            radial-gradient(circle at 10% 40%, rgba(0, 242, 255, 0.03) 0%, transparent 40%);
        }
      `}</style>
    </div>
  );
};

const TabButton = ({ icon, isActive, onClick, label, isSpecial = false }: any) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
      transition: 'all 0.2s ease',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      position: 'relative'
    }}
  >
    {icon}
    {!isSpecial && <span style={{ fontSize: '10px', fontWeight: '600' }}>{label}</span>}
    {isActive && !isSpecial && (
      <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: '-12px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
    )}
  </button>
);

export default App;

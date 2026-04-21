import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon } from 'lucide-react';

const ChatSection = () => {
  const [activeMentor, setActiveMentor] = useState('dietitian');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [messages, setMessages] = useState({
    dietitian: [{ id: 1, text: "Merhaba Hamza! Bugün ne yedin? Fotoğrafını çek gönder analiz edelim.", sender: 'ai', time: '09:15' }],
    pt: [{ id: 1, text: "Selam! Bugünkü antrenmana hazır mısın?", sender: 'ai', time: '10:00' }]
  });

  const mentors = {
    dietitian: { name: "Dyt. Melis", role: "AI Diyetisyen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Melis", color: "var(--accent-secondary)" },
    pt: { name: "Hoca Murat", role: "AI Antrenör", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Murat", color: "var(--accent-primary)" }
  };

  const handleSend = (textInput = inputValue, holdsImage = false) => {
    if (!textInput.trim() && !holdsImage) return;

    const userMsg = { 
      id: Date.now(), 
      text: holdsImage ? "📸 Bir fotoğraf paylaştı" : textInput, 
      sender: 'user', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages(prev => ({ ...prev, [activeMentor]: [...prev[activeMentor], userMsg] }));
    setInputValue('');

    if (holdsImage) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        const aiResponse = {
          id: Date.now() + 1,
          text: "Harika bir tabak! 🥗 Analiz ettim:\n\n• Somon (150g): 300 kcal\n• Kinoa (100g): 120 kcal\n• Toplam: 420 kcal\n• Protein: 35g\n\nAkşam için çok dengeli bir seçim, tebrikler!",
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({ ...prev, [activeMentor]: [...prev[activeMentor], aiResponse] }));
      }, 3000);
    } else {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: activeMentor === 'dietitian' ? "Anladım, bunu not aldım. Su içmeyi unutma!" : "Süper, antrenman sonrası 1 ölçek protein almayı ihmal etme. 🔥",
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({ ...prev, [activeMentor]: [...prev[activeMentor], aiResponse] }));
      }, 1500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', gap: '12px' }}>
      {/* Mentor Switcher - Pill Style */}
      <div style={{ 
        display: 'flex', 
        background: 'var(--surface-color)', 
        padding: '4px', 
        borderRadius: '16px',
        border: '1px solid var(--border-color)'
      }}>
        {['dietitian', 'pt'].map(m => (
          <button 
            key={m} 
            onClick={() => setActiveMentor(m)} 
            style={{ 
              flex: 1, 
              padding: '8px', 
              borderRadius: '12px', 
              background: activeMentor === m ? 'var(--accent-primary)' : 'transparent', 
              color: activeMentor === m ? '#000' : 'var(--text-secondary)', 
              fontWeight: '700',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            {m === 'dietitian' ? 'Diyetisyen' : 'Antrenör'}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="glass-card" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        border: '1px solid var(--glass-border)'
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
           <img src={mentors[activeMentor].avatar} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface-hover)' }} />
           <div>
             <h4 style={{ fontSize: '14px' }}>{mentors[activeMentor].name}</h4>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Çevrimiçi</p>
             </div>
           </div>
        </div>

        {/* Messages */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px'
        }}>
          {messages[activeMentor].map(msg => (
            <div key={msg.id} style={{ 
              alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end', 
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{ 
                padding: '10px 14px', 
                borderRadius: msg.sender === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', 
                background: msg.sender === 'ai' ? 'var(--surface-hover)' : 'var(--accent-primary)', 
                color: msg.sender === 'ai' ? '#fff' : '#000', 
                fontSize: '14px',
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '9px', color: 'var(--text-secondary)', alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end' }}>{msg.time}</span>
            </div>
          ))}
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <div className="loader" style={{ width: '16px', height: '16px', border: '2px solid var(--accent-secondary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ fontSize: '12px', color: 'var(--accent-secondary)' }}>AI yemeği analiz ediyor...</p>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => handleSend('', true)} 
            style={{ color: 'var(--text-secondary)', padding: '4px' }}
          >
            <ImageIcon size={22} />
          </button>
          <div style={{ flex: 1, display: 'flex', background: 'var(--surface-color)', borderRadius: '24px', padding: '4px 4px 4px 16px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Mesaj yaz..." 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()} 
              style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }} 
            />
            <button onClick={() => handleSend()} style={{ width: '36px', height: '36px', background: 'var(--accent-primary)', borderRadius: '50%', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} style={{ margin: 'auto' }} />
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ChatSection;

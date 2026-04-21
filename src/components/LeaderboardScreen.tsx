import { useEffect, useState } from 'react';
import type { Habit } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserPlus, UserMinus } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  isCurrentUser?: boolean;
}

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#b45309'];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

function calcScore(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + h.completedDays.length * 10 + h.streak * 5, 0);
}

const AVATARS = ['😊', '🦁', '🐯', '🦊', '🐺', '🦅', '🌟', '🔥', '💎', '🚀'];

function getFriendIds(): string[] {
  try { return JSON.parse(localStorage.getItem('flowbit_friends') || '[]'); } catch { return []; }
}

function setFriendIds(ids: string[]) {
  localStorage.setItem('flowbit_friends', JSON.stringify(ids));
}

interface Props {
  habits: Habit[];
  userName?: string;
  currentUserId?: string;
}

export const LeaderboardScreen = ({ habits, userName = 'Sen', currentUserId }: Props) => {
  const [firestoreUsers, setFirestoreUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tümü' | 'arkadaşlar'>('tümü');
  const [friendIds, setFriendIdsState] = useState<string[]>(getFriendIds);

  const userScore = calcScore(habits);
  const userStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const users: LeaderboardUser[] = snap.docs
          .filter(d => d.id !== currentUserId)
          .map((d, i) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name || data.email?.split('@')[0] || 'Kullanıcı',
              avatar: AVATARS[i % AVATARS.length],
              score: data.score || 0,
              streak: data.streak || 0,
            };
          });
        setFirestoreUsers(users);
      } catch {
        setFirestoreUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const toggleFriend = (userId: string) => {
    const current = getFriendIds();
    const updated = current.includes(userId)
      ? current.filter(id => id !== userId)
      : [...current, userId];
    setFriendIds(updated);
    setFriendIdsState(updated);
  };

  const currentUser: LeaderboardUser = {
    id: currentUserId || 'current',
    name: userName,
    avatar: '⭐',
    score: userScore,
    streak: userStreak,
    isCurrentUser: true,
  };

  const allUsers: LeaderboardUser[] = [
    ...firestoreUsers,
    currentUser,
  ].sort((a, b) => b.score - a.score);

  const displayUsers = activeTab === 'arkadaşlar'
    ? allUsers.filter(u => u.isCurrentUser || friendIds.includes(u.id))
    : allUsers;

  const top3 = displayUsers.slice(0, 3);
  const rest = displayUsers.slice(3);
  const userRank = displayUsers.findIndex(u => u.isCurrentUser) + 1;

  const podiumOrder = [top3[1], top3[0], top3[2]];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <span style={{ color: 'var(--text-dim)' }}>Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Sıralama</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: 4 }}>
          En iyi alışkanlık takipçileri
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['tümü', 'arkadaşlar'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem',
              border: activeTab === tab ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
              background: activeTab === tab ? 'rgba(14,165,233,0.15)' : 'var(--surface)',
              color: activeTab === tab ? 'var(--accent-blue)' : 'var(--text-dim)',
              cursor: 'pointer',
            }}
          >
            {tab === 'tümü' ? '🌍 Tümü' : '👥 Arkadaşlarım'}
            {tab === 'arkadaşlar' && friendIds.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--accent-blue)', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: '0.7rem' }}>
                {friendIds.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {displayUsers.length <= 1 && activeTab === 'arkadaşlar' ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>👥</div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Henüz arkadaş yok</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            "Tümü" sekmesinde kullanıcıların yanındaki + butonuna bas
          </div>
        </div>
      ) : (
        <>
          {/* Podium */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
            {podiumOrder.map((user, i) => {
              if (!user) return null;
              const rank = displayUsers.indexOf(user) + 1;
              const heights = [100, 130, 85];
              const h = heights[i];
              return (
                <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                  {rank <= 3 && <span style={{ fontSize: '1.4rem' }}>{RANK_LABELS[rank - 1]}</span>}
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: user.isCurrentUser ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'var(--surface-alt)',
                    border: `2px solid ${RANK_COLORS[rank - 1] || 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                    boxShadow: `0 4px 16px ${RANK_COLORS[rank - 1] || 'transparent'}44`,
                  }}>{user.avatar}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 70 }}>{user.name}</span>
                  <div style={{
                    width: '100%', height: h,
                    background: `linear-gradient(180deg, ${RANK_COLORS[rank - 1] || 'var(--border)'}33, ${RANK_COLORS[rank - 1] || 'var(--border)'}11)`,
                    borderRadius: '12px 12px 0 0',
                    border: `1px solid ${RANK_COLORS[rank - 1] || 'var(--border)'}44`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: RANK_COLORS[rank - 1] || 'var(--text-muted)' }}>{user.score}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600 }}>puan</span>
                  </div>
                </div>
              );
            })}
          </div>

          {userRank > 3 && (
            <div style={{
              margin: '0 0 20px',
              padding: '14px 18px',
              background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(37,99,235,0.1))',
              border: '1px solid rgba(14,165,233,0.3)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)', minWidth: 28 }}>#{userRank}</span>
                <span style={{ fontSize: '1.5rem' }}>⭐</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Senin Sıralaman</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{userScore} puan · {userStreak} seri</div>
                </div>
              </div>
              {displayUsers[userRank - 2] && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700, textAlign: 'right' }}>
                  +{displayUsers[userRank - 2].score - userScore} puan<br />
                  <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>üste geç</span>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rest.map((user) => {
              const rank = displayUsers.indexOf(user) + 1;
              const isFriend = friendIds.includes(user.id);
              return (
                <div key={user.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: user.isCurrentUser ? 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(37,99,235,0.08))' : 'var(--surface)',
                  border: user.isCurrentUser ? '1px solid rgba(14,165,233,0.3)' : '1px solid var(--border)',
                  borderRadius: 14,
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dim)', minWidth: 24, textAlign: 'center' }}>{rank}</span>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: user.isCurrentUser ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'var(--surface-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                    border: '1px solid var(--border)',
                  }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: user.isCurrentUser ? 'var(--accent-blue)' : 'var(--text-main)' }}>
                      {user.name} {user.isCurrentUser && <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>(sen)</span>}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{user.streak} gün seri</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-muted)', marginRight: 8 }}>
                    {user.score} <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>puan</span>
                  </span>
                  {!user.isCurrentUser && (
                    <button
                      onClick={() => toggleFriend(user.id)}
                      style={{
                        background: isFriend ? 'rgba(239,68,68,0.1)' : 'rgba(14,165,233,0.1)',
                        border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer',
                        color: isFriend ? 'var(--accent-red)' : 'var(--accent-blue)',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      {isFriend ? <UserMinus size={15} /> : <UserPlus size={15} />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
          Puan hesaplama: her tamamlanan gün <strong style={{ color: 'var(--text-muted)' }}>×10</strong> · her seri günü <strong style={{ color: 'var(--text-muted)' }}>×5</strong>
        </p>
      </div>
    </div>
  );
};

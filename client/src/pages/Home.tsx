import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkedInToday, setCheckedInToday] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()
        if (!data) { navigate('/signin'); return }
        setUser(data)

        const today = new Date().toISOString().split('T')[0]
        const { data: checkin } = await supabase
          .from('daily_checkins')
          .select('id')
          .eq('user_id', data.id)
          .eq('checkin_date', today)
          .maybeSingle()

        setCheckedInToday(!!checkin)
        setLoading(false)
      } catch (e: any) {
        setLoading(false)
      }
    }
    loadUser()
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <div style={{ padding: '48px 20px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 600, color: '#FAF7F2', marginBottom: '4px' }}>
          MS<span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>
        {user && (
          <div style={{ fontSize: '14px', color: '#8FAF9F' }}>
            Welcome back, {user.display_name} 🌿
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading...</div>
      )}

      {!loading && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Check-in card */}
          <div style={{
            background: checkedInToday ? '#EDF3F0' : '#FAF7F2',
            borderRadius: '20px', padding: '24px'
          }}>
            {checkedInToday ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#5C7A6B' }}>
                  Check-in complete
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                  Great job checking in today
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A', marginBottom: '4px' }}>
                  Daily Check-in
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', lineHeight: 1.5 }}>
                  How are you feeling today? Takes 2 minutes.
                </div>
                <button onClick={() => navigate('/checkin')} style={{
                  background: '#1C2B3A', color: '#FAF7F2', border: 'none',
                  borderRadius: '50px', padding: '14px 28px', fontSize: '14px',
                  fontWeight: 500, cursor: 'pointer', width: '100%'
                }}>
                  Start Check-in →
                </button>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/train')} style={{
              flex: 1, background: '#FAF7F2', borderRadius: '20px', padding: '20px',
              border: 'none', cursor: 'pointer', textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧠</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>Train</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Cognitive exercises</div>
            </button>
            <button onClick={() => navigate('/community')} style={{
              flex: 1, background: '#FAF7F2', borderRadius: '20px', padding: '20px',
              border: 'none', cursor: 'pointer', textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>Community</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>You are not alone</div>
            </button>
          </div>

          {/* Profile strip */}
          {user && (
            <div style={{
              background: '#FAF7F2', borderRadius: '20px', padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
                  @{user.username}
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                  {user.ms_type?.toUpperCase()}
                </div>
              </div>
              <button onClick={() => supabase.auth.signOut()} style={{
                background: 'transparent', color: '#6B7280',
                border: '1.5px solid #E0E0E0', borderRadius: '50px',
                padding: '8px 16px', fontSize: '12px', cursor: 'pointer'
              }}>
                Sign Out
              </button>
            </div>
          )}

        </div>
      )}

      <BottomNav />
    </div>
  )
}

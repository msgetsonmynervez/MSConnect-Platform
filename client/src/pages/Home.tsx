import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'
import FogView from '../components/FogView'
import { useEnergy } from '../context/EnergyContext'

interface StreakData {
  current_streak_days: number
  longest_streak_days: number
  paused_since: string | null
  pause_reason: string | null
}

interface AlertState {
  symptom_alert?: boolean
  alert_set_at?: string
  dismissed_at?: string | null
}

export default function Home() {
  const navigate = useNavigate()
  const { fogMode } = useEnergy()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [alertState, setAlertState] = useState<AlertState>({})
  const [dismissingAlert, setDismissingAlert] = useState(false)

  useEffect(() => {
    async function loadHome() {
      try {
        const data = await getCurrentUser()
        if (!data) { navigate('/signin'); return }
        setUser(data)
        setAlertState(data.alert_state ?? {})

        const today = new Date().toISOString().split('T')[0]

        const [checkinResult, streakResult] = await Promise.all([
          supabase
            .from('daily_checkins')
            .select('id')
            .eq('user_id', data.id)
            .eq('checkin_date', today)
            .maybeSingle(),
          supabase
            .from('training_streaks')
            .select('current_streak_days, longest_streak_days, paused_since, pause_reason')
            .eq('user_id', data.id)
            .maybeSingle()
        ])

        setCheckedInToday(!!checkinResult.data)
        setStreak(streakResult.data ?? null)
        setLoading(false)
      } catch (e: any) {
        setLoading(false)
      }
    }
    loadHome()
  }, [navigate])

  async function dismissAlert() {
    if (!user) return
    setDismissingAlert(true)
    const today = new Date().toISOString().split('T')[0]
    await supabase
      .from('users')
      .update({ alert_state: { ...alertState, dismissed_at: today } })
      .eq('id', user.id)
    setAlertState(a => ({ ...a, dismissed_at: today }))
    setDismissingAlert(false)
  }

  const showSymptomAlert = alertState.symptom_alert && !alertState.dismissed_at
  const streakPaused = streak?.paused_since != null

  if (fogMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C2B3A' }}>
        <FogView
          title={checkedInToday ? "You've checked in today" : "Time to check in"}
          primaryLabel={checkedInToday ? "Go to Training 🧠" : "Start Check-in →"}
          onPrimary={() => navigate(checkedInToday ? '/train' : '/checkin')}
        />
        <BottomNav />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader
        title={`MS${'\u200B'}Connect`}
        subtitle={user ? `Welcome back, ${user.display_name} 🌿` : ''}
      />

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading...</div>
      )}

      {!loading && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {showSymptomAlert && (
            <div style={{
              background: '#FEF3C7', borderRadius: '20px', padding: '20px',
              border: '1.5px solid #F59E0B'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', marginBottom: '6px' }}>
                🌡️ Symptom pattern noticed
              </div>
              <p style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.6, marginBottom: '14px' }}>
                You've logged several difficult symptoms over the past few days. Consider reaching out to your care team if things feel unmanageable.
              </p>
              <button onClick={dismissAlert} disabled={dismissingAlert} style={{
                background: 'transparent', border: '1.5px solid #F59E0B',
                borderRadius: '50px', padding: '8px 20px', fontSize: '13px',
                color: '#92400E', cursor: 'pointer', fontWeight: 500
              }}>
                Thanks, got it
              </button>
            </div>
          )}

          {streak !== null && (
            <div style={{
              background: streakPaused ? '#EFF6FF' : '#FAF7F2',
              borderRadius: '20px', padding: '20px',
              border: streakPaused ? '1.5px solid #93C5FD' : 'none'
            }}>
              {streakPaused ? (
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1D4ED8', marginBottom: '6px' }}>
                    💙 Rest Mode
                  </div>
                  <p style={{ fontSize: '13px', color: '#1D4ED8', lineHeight: 1.6 }}>
                    Your streak is paused while you rest. It will resume automatically when you're feeling better. Your progress is safe.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Training Streak</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C2B3A' }}>
                      {streak.current_streak_days} <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>days</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Personal Best</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#5C7A6B' }}>
                      {streak.longest_streak_days} <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{
            background: checkedInToday ? '#EDF3F0' : '#FAF7F2',
            borderRadius: '20px', padding: '24px'
          }}>
            {checkedInToday ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#5C7A6B' }}>Check-in complete</div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Great job checking in today</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A', marginBottom: '4px' }}>Daily Check-in</div>
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

          {user && (
            <div style={{
              background: '#FAF7F2', borderRadius: '20px', padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>@{user.username}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{user.ms_type?.toUpperCase()}</div>
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

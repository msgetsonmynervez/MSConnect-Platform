import { useEffect, useState, useRef } from 'react'
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
}

interface AlertState {
  symptom_alert?: boolean
  dismissed_at?: string | null
}

interface Stats {
  total_checkins: number
  total_sessions: number
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getCountdown(): string {
  const now = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const diff = tomorrow.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return h + 'h ' + m + 'm'
}

function getToday(): string {
  const d = new Date()
  const iso = d.toISOString()
  const parts = iso.split('T')
  return parts[0]
}

const FONT_OPTIONS = [
  { label: 'A', scale: 0.85, size: '12px' },
  { label: 'A', scale: 1, size: '15px' },
  { label: 'A', scale: 1.2, size: '18px' },
  { label: 'A', scale: 1.4, size: '21px' },
]

export default function Home() {
  const navigate = useNavigate()
  const { fogMode, fontScale, setFontScale } = useEnergy()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [alertState, setAlertState] = useState<AlertState>({})
  const [stats, setStats] = useState<Stats>({ total_checkins: 0, total_sessions: 0 })
  const [dismissingAlert, setDismissingAlert] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [sessionToast, setSessionToast] = useState(false)
  const [countdown, setCountdown] = useState(getCountdown())
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reset = () => {
      if (sessionTimer.current) clearTimeout(sessionTimer.current)
      setSessionToast(false)
      sessionTimer.current = setTimeout(() => setSessionToast(true), 8 * 60 * 1000)
    }
    window.addEventListener('mousemove', reset)
    window.addEventListener('touchstart', reset)
    reset()
    return () => {
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('touchstart', reset)
      if (sessionTimer.current) clearTimeout(sessionTimer.current)
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown()), 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const data = await getCurrentUser()
        if (!data) {
          navigate('/signin')
          return
        }
        setUser(data)
        setAlertState(data.alert_state ?? {})

        const today = getToday()

        const [ci, str, tc, ts] = await Promise.all([
          supabase
            .from('daily_checkins')
            .select('id')
            .eq('user_id', data.id)
            .eq('checkin_date', today)
            .maybeSingle(),
          supabase
            .from('training_streaks')
            .select('current_streak_days,longest_streak_days,paused_since')
            .eq('user_id', data.id)
            .maybeSingle(),
          supabase
            .from('daily_checkins')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', data.id),
          supabase
            .from('training_sessions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', data.id)
            .eq('status', 'completed'),
        ])

        setCheckedInToday(!!ci.data)
        setStreak(str.data ?? null)
        setStats({ total_checkins: tc.count ?? 0, total_sessions: ts.count ?? 0 })
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  async function dismissAlert() {
    if (!user) return
    setDismissingAlert(true)
    const today = getToday()
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
          primaryLabel={checkedInToday ? 'Go to Training' : 'Start Check-in'}
          onPrimary={() => navigate(checkedInToday ? '/train' : '/checkin')}
        />
        <BottomNav />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>

      {sessionToast && (
        <div style={{
          position: 'fixed', top: '16px', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1C2B3A', border: '1.5px solid #5C7A6B',
          borderRadius: '50px', padding: '10px 20px',
          fontSize: '13px', color: '#FAF7F2', zIndex: 300,
          display: 'flex', gap: '12px', alignItems: 'center',
        }}>
          <span>Still there? 🌿</span>
          <button onClick={() => setSessionToast(false)} style={{
            background: '#5C7A6B', border: 'none', borderRadius: '20px',
            padding: '4px 12px', color: '#FAF7F2', fontSize: '12px', cursor: 'pointer',
          }}>Yes</button>
        </div>
      )}

      <AppHeader
        title="MSConnect"
        subtitle={user ? getGreeting() + ', ' + user.display_name + ' 🌿' : ''}
      />

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>
          Loading...
        </div>
      )}

      {!loading && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {showSymptomAlert && (
            <div style={{
              background: '#FEF3C7', borderRadius: '20px',
              padding: '20px', border: '1.5px solid #F59E0B',
            }}>
              <div style={{
                fontSize: '15px', fontWeight: 600,
                color: '#92400E', marginBottom: '6px',
              }}>
                Symptom pattern noticed
              </div>
              <p style={{
                fontSize: '13px', color: '#92400E',
                lineHeight: 1.6, marginBottom: '14px',
              }}>
                You have logged several difficult symptoms recently.
                Consider reaching out to your care team.
              </p>
              <button
                onClick={dismissAlert}
                disabled={dismissingAlert}
                style={{
                  background: 'transparent', border: '1.5px solid #F59E0B',
                  borderRadius: '50px', padding: '8px 20px',
                  fontSize: '13px', color: '#92400E',
                  cursor: 'pointer', fontWeight: 500,
                }}>
                Thanks, got it
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { label: 'Check-ins', value: stats.total_checkins, emoji: '✅' },
              { label: 'Sessions', value: stats.total_sessions, emoji: '🧠' },
              { label: 'Streak', value: (streak?.current_streak_days ?? 0) + 'd', emoji: '🔥' },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: '#FAF7F2', borderRadius: '16px',
                padding: '14px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{s.emoji}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C2B3A' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {streak !== null && (
            <div style={{
              background: streakPaused ? '#EFF6FF' : '#FAF7F2',
              borderRadius: '20px', padding: '20px',
              border: streakPaused ? '1.5px solid #93C5FD' : 'none',
            }}>
              {streakPaused ? (
                <div>
                  <div style={{
                    fontSize: '15px', fontWeight: 600,
                    color: '#1D4ED8', marginBottom: '6px',
                  }}>
                    Rest Mode
                  </div>
                  <p style={{ fontSize: '13px', color: '#1D4ED8', lineHeight: 1.6 }}>
                    Your streak is paused while you rest.
                    It will resume when you are feeling better.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                      Training Streak
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1C2B3A' }}>
                      {streak.current_streak_days}
                      <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
                        {' days'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                      Best
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#5C7A6B' }}>
                      {streak.longest_streak_days}
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>
                        {' days'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{
            background: checkedInToday ? '#EDF3F0' : '#FAF7F2',
            borderRadius: '20px', padding: '24px',
          }}>
            {checkedInToday ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#5C7A6B' }}>
                  Check-in complete
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
                  {'Next in '}
                  <span style={{ fontWeight: 600, color: '#5C7A6B' }}>{countdown}</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: '4px',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A' }}>
                    Daily Check-in
                  </div>
                  <div style={{ fontSize: '11px', color: '#C4714A', fontWeight: 500 }}>
                    {'Closes in ' + countdown}
                  </div>
                </div>
                <div style={{
                  fontSize: '13px', color: '#6B7280',
                  marginBottom: '16px', lineHeight: 1.5,
                }}>
                  How are you feeling today? Takes 2 minutes.
                </div>
                <button onClick={() => navigate('/checkin')} style={{
                  background: '#1C2B3A', color: '#FAF7F2', border: 'none',
                  borderRadius: '50px', padding: '14px 28px', fontSize: '14px',
                  fontWeight: 500, cursor: 'pointer', width: '100%',
                }}>
                  Start Check-in
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => navigate('/train')} style={{
              flex: 1, background: '#FAF7F2', borderRadius: '20px',
              padding: '20px', border: 'none', cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧠</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>Train</div>
            </button>
            <button onClick={() => navigate('/community')} style={{
              flex: 1, background: '#FAF7F2', borderRadius: '20px',
              padding: '20px', border: 'none', cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>Community</div>
            </button>
          </div>

          {user?.neurologist_name && (
            <div style={{ background: '#FAF7F2', borderRadius: '20px', padding: '20px' }}>
              <div style={{
                fontSize: '13px', color: '#6B7280',
                marginBottom: '10px', fontWeight: 500,
              }}>
                Care Team
              </div>
              <div style={{
                fontSize: '14px', fontWeight: 600,
                color: '#1C2B3A', marginBottom: '4px',
              }}>
                {user.neurologist_name}
              </div>
              {user.neurologist_phone && (
                <a
                  href={'tel:' + user.neurologist_phone}
                  style={{
                    fontSize: '13px', color: '#5C7A6B',
                    fontWeight: 500, textDecoration: 'none',
                  }}>
                  {user.neurologist_phone}
                </a>
              )}
            </div>
          )}

          <button onClick={() => setShowProfile(true)} style={{
            background: '#FAF7F2', borderRadius: '20px', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
                {'@' + user?.username}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                {user?.ms_type?.toUpperCase()}
              </div>
            </div>
            <div style={{ fontSize: '18px', color: '#8FAF9F' }}>›</div>
          </button>

        </div>
      )}

      {showProfile && user && (
        <div
          onClick={() => setShowProfile(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 200, display: 'flex', alignItems: 'flex-end',
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FAF7F2', borderRadius: '24px 24px 0 0',
              padding: '32px 24px 48px', width: '100%',
            }}>
            <div style={{
              width: '40px', height: '4px', background: '#E0E0E0',
              borderRadius: '2px', margin: '0 auto 24px',
            }} />

            <div style={{
              fontSize: '20px', fontWeight: 700,
              color: '#1C2B3A', marginBottom: '4px',
            }}>
              {user.display_name}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
              {'@' + user.username + ' · ' + user.ms_type?.toUpperCase()}
              {user.diagnosis_year ? ' · Diagnosed ' + user.diagnosis_year : ''}
            </div>

            {[
              { label: 'Total Check-ins', value: stats.total_checkins },
              { label: 'Training Sessions', value: stats.total_sessions },
              { label: 'Current Streak', value: (streak?.current_streak_days ?? 0) + ' days' },
              { label: 'Personal Best', value: (streak?.longest_streak_days ?? 0) + ' days' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid #F0EDE8',
              }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>{s.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>
                  {s.value}
                </span>
              </div>
            ))}

            <div style={{ margin: '20px 0' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '10px',
              }}>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>Text Size</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C2B3A' }}>
                  {fontScale <= 0.85 ? 'Small' : fontScale >= 1.4 ? 'Largest' : fontScale >= 1.2 ? 'Large' : 'Default'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {FONT_OPTIONS.map(opt => {
                  const sel = Math.abs(fontScale - opt.scale) < 0.05
                  return (
                    <button
                      key={opt.scale}
                      onClick={() => setFontScale(opt.scale)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
                        background: sel ? '#1C2B3A' : '#F0EDE8',
                        color: sel ? '#FAF7F2' : '#6B7280',
                        fontSize: opt.size,
                        fontWeight: sel ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => { supabase.auth.signOut(); navigate('/signin') }}
              style={{
                width: '100%', background: 'transparent',
                border: '1.5px solid #E0E0E0', borderRadius: '50px',
                padding: '14px', fontSize: '14px', color: '#6B7280', cursor: 'pointer',
              }}>
              Sign Out
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'
import FogView from '../components/FogView'
import { useEnergy } from '../context/EnergyContext'

interface Exercise {
  id: string
  name: string
  cognitive_domain: string
  difficulty_levels: number
  icon_emoji: string
  description: string
}

const DOMAIN_LABELS: Record<string, string> = {
  working_memory: 'Working Memory',
  processing_speed: 'Processing Speed',
  attention: 'Attention',
  visual_spatial: 'Visual Spatial',
  word_fluency: 'Word Fluency',
  executive_function: 'Executive Function',
}

const DOMAIN_COLORS: Record<string, string> = {
  working_memory: '#648FFF',
  processing_speed: '#FFB000',
  attention: '#5C7A6B',
  visual_spatial: '#C4714A',
  word_fluency: '#8FAF9F',
  executive_function: '#FE6100',
}

const GAME_ROUTES: Record<string, string> = {
  'cad27415-9afd-4d19-b88b-7e20f933421b': '/games/memory-match',
  '2b5faae0-4d1a-4e54-b2b6-8bdb4a0732b0': '/games/tap-target',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return m + ':' + s
}

export default function Train() {
  const navigate = useNavigate()
  const { fogMode } = useEnergy()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null)
  const [activeSession, setActiveSession] = useState<{ ex: Exercise; sessionId: string } | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [scoreScreen, setScoreScreen] = useState<{ ex: Exercise; duration: number; score: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('training_exercises')
        .select('id,name,cognitive_domain,difficulty_levels,icon_emoji,description')
        .eq('is_active', true)
        .order('sort_order')
      setExercises(data ?? [])
      setLoading(false)
    }
    load()
  }, [navigate])

  async function startSession(ex: Exercise) {
    if (!userId) return
    setSelectedEx(null)

    const route = GAME_ROUTES[ex.id]
    if (route) {
      navigate(route)
      return
    }

    setElapsed(0)
    const { data } = await supabase
      .from('training_sessions')
      .insert({
        user_id: userId,
        exercise_id: ex.id,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .select('id')
      .single()
    if (!data) return
    setActiveSession({ ex, sessionId: data.id })
    timerRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
  }

  async function endSession() {
    if (!activeSession) return
    if (timerRef.current) clearInterval(timerRef.current)
    const duration = elapsed
    const norm = Math.max(0.4, Math.min(1, 0.5 + (duration / 120) * 0.5))
    const score = Math.round(norm * 100)
    await supabase.from('training_sessions').update({
      status: 'completed',
      duration_seconds: duration,
      score_normalized: norm,
    }).eq('id', activeSession.sessionId)
    await supabase.rpc('recalculate_streak', { p_user_id: userId })
    if (navigator.vibrate) navigator.vibrate([40, 30, 40])
    setScoreScreen({ ex: activeSession.ex, duration, score })
    setActiveSession(null)
    setElapsed(0)
  }

  if (activeSession) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1C2B3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: '#FAF7F2',
          borderRadius: '24px',
          padding: '40px 28px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>
            {activeSession.ex.icon_emoji}
          </div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '22px',
            fontWeight: 600,
            color: '#1C2B3A',
            marginBottom: '8px',
          }}>
            {activeSession.ex.name}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '32px' }}>
            {DOMAIN_LABELS[activeSession.ex.cognitive_domain]}
          </div>
          <div style={{
            fontSize: '56px',
            fontWeight: 700,
            color: '#1C2B3A',
            letterSpacing: '-2px',
            marginBottom: '8px',
          }}>
            {formatTime(elapsed)}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '40px' }}>
            Session in progress
          </div>
          <div style={{
            background: '#EDF3F0',
            borderRadius: '16px',
            padding: '16px',
            fontSize: '13px',
            color: '#5C7A6B',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            {activeSession.ex.description}
          </div>
          <button onClick={endSession} style={{
            background: '#5C7A6B',
            color: '#FAF7F2',
            border: 'none',
            borderRadius: '50px',
            padding: '18px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
          }}>
            Finish Session
          </button>
        </div>
      </div>
    )
  }

  if (scoreScreen) {
    const pct = scoreScreen.score
    const grade = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : 'Keep Going'
    const gradeEmoji = pct >= 80 ? '🌟' : pct >= 60 ? '💪' : '🌱'
    const ringDeg = pct * 3.6
    const ringStyle = 'conic-gradient(#5C7A6B ' + ringDeg + 'deg, #E0E0E0 0deg)'
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1C2B3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: '#FAF7F2',
          borderRadius: '24px',
          padding: '40px 28px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>{gradeEmoji}</div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#1C2B3A',
            marginBottom: '4px',
          }}>
            {grade}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>
            {scoreScreen.ex.name + ' · ' + formatTime(scoreScreen.duration)}
          </div>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: ringStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C2B3A' }}>
                {pct + '%'}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>score</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              flex: 1,
              background: '#EDF3F0',
              borderRadius: '14px',
              padding: '14px',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1C2B3A' }}>
                {formatTime(scoreScreen.duration)}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Duration</div>
            </div>
            <div style={{
              flex: 1,
              background: '#EDF3F0',
              borderRadius: '14px',
              padding: '14px',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1C2B3A' }}>
                {pct + '%'}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>Score</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setScoreScreen(null); startSession(scoreScreen.ex) }}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#5C7A6B',
                border: '1.5px solid #5C7A6B',
                borderRadius: '50px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <button onClick={() => setScoreScreen(null)} style={{
              flex: 1,
              background: '#1C2B3A',
              color: '#FAF7F2',
              border: 'none',
              borderRadius: '50px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}>
              All Exercises
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (fogMode) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C2B3A' }}>
        <FogView
          title="Pick one exercise"
          primaryLabel="Start Memory Match"
          onPrimary={() => navigate('/games/memory-match')}
        />
        <BottomNav />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="Train" subtitle="Keep your mind sharp" />
      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>
          Loading exercises...
        </div>
      )}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {exercises.map(ex => {
          const domainColor = DOMAIN_COLORS[ex.cognitive_domain] ?? '#8FAF9F'
          const hasGame = !!GAME_ROUTES[ex.id]
          return (
            <button key={ex.id} onClick={() => setSelectedEx(ex)} style={{
              background: '#FAF7F2',
              borderRadius: '20px',
              padding: '20px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: domainColor + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                flexShrink: 0,
              }}>
                {ex.icon_emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A' }}>
                    {ex.name}
                  </div>
                  {hasGame && (
                    <div style={{
                      background: '#EDF3F0',
                      color: '#5C7A6B',
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}>
                      GAME
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '6px',
                  color: domainColor,
                }}>
                  {DOMAIN_LABELS[ex.cognitive_domain] ?? ex.cognitive_domain}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.4 }}>
                  {ex.description}
                </div>
              </div>
              <div style={{ fontSize: '20px', color: '#C4714A', flexShrink: 0 }}>›</div>
            </button>
          )
        })}
      </div>

      {selectedEx && (
        <div onClick={() => setSelectedEx(null)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#FAF7F2',
            borderRadius: '24px 24px 0 0',
            padding: '32px 24px 48px',
            width: '100%',
          }}>
            <div style={{
              width: '40px',
              height: '4px',
              background: '#E0E0E0',
              borderRadius: '2px',
              margin: '0 auto 24px',
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                flexShrink: 0,
                background: (DOMAIN_COLORS[selectedEx.cognitive_domain] ?? '#8FAF9F') + '22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>
                {selectedEx.icon_emoji}
              </div>
              <div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1C2B3A',
                  marginBottom: '4px',
                }}>
                  {selectedEx.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: DOMAIN_COLORS[selectedEx.cognitive_domain] ?? '#8FAF9F',
                }}>
                  {DOMAIN_LABELS[selectedEx.cognitive_domain]}
                </div>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}>
              {selectedEx.description}
            </p>
            <div style={{
              background: '#EDF3F0',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '24px',
            }}>
              <div style={{
                fontSize: '12px',
                color: '#5C7A6B',
                fontWeight: 600,
                marginBottom: '4px',
              }}>
                What to expect
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
                {GAME_ROUTES[selectedEx.id]
                  ? '60 second game. Your score is recorded automatically when the timer ends.'
                  : 'Complete the exercise at your own pace. Tap Finish when you are done.'}
              </div>
            </div>
            <button onClick={() => startSession(selectedEx)} style={{
              background: '#1C2B3A',
              color: '#FAF7F2',
              border: 'none',
              borderRadius: '50px',
              padding: '18px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}>
              {GAME_ROUTES[selectedEx.id] ? 'Play Game' : 'Start Session'}
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  )
}

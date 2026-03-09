import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../../lib/supabase'

const EXERCISE_ID = '2b5faae0-4d1a-4e54-b2b6-8bdb4a0732b0'
const GAME_DURATION = 60
const TARGET_LIFETIME = 1200

interface Target {
  id: number
  x: number
  y: number
  size: number
  born: number
}

export default function TapTarget() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [targets, setTargets] = useState<Target[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextId = useRef(0)
  const hitsRef = useRef(0)
  const missesRef = useRef(0)

  useEffect(() => {
    getCurrentUser().then(u => {
      if (!u) { navigate('/signin'); return }
      setUserId(u.id)
    })
  }, [navigate])

  async function startGame() {
    if (!userId) return
    const { data } = await supabase
      .from('training_sessions')
      .insert({
        user_id: userId,
        exercise_id: EXERCISE_ID,
        started_at: new Date().toISOString(),
        status: 'in_progress',
      })
      .select('id')
      .single()
    if (data) setSessionId(data.id)
    setTargets([])
    setHits(0)
    setMisses(0)
    hitsRef.current = 0
    missesRef.current = 0
    nextId.current = 0
    setTimeLeft(GAME_DURATION)
    setPhase('playing')

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          clearInterval(spawnRef.current!)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)

    spawnRef.current = setInterval(() => {
      const size = 48 + Math.random() * 32
      const x = 5 + Math.random() * 80
      const y = 15 + Math.random() * 65
      const id = nextId.current
      nextId.current += 1
      const born = Date.now()
      setTargets(prev => {
        const alive = prev.filter(t => Date.now() - t.born < TARGET_LIFETIME)
        return [...alive, { id, x, y, size, born }]
      })
    }, 900)
  }

  useEffect(() => {
    if (phase === 'done') {
      finishGame()
    }
  }, [phase])

  async function finishGame() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (spawnRef.current) clearInterval(spawnRef.current)
    const h = hitsRef.current
    const m = missesRef.current
    const total = h + m
    const acc = total > 0 ? h / total : 0
    const speed = Math.min(1, h / 30)
    const final = Math.round((speed * 0.6 + acc * 0.4) * 100)
    setScore(final)
    const norm = final / 100
    if (sessionId && userId) {
      await supabase.from('training_sessions').update({
        status: 'completed',
        duration_seconds: GAME_DURATION,
        score_normalized: norm,
      }).eq('id', sessionId)
      await supabase.rpc('recalculate_streak', { p_user_id: userId })
    }
    if (navigator.vibrate) navigator.vibrate([40, 30, 40])
  }

  function hitTarget(id: number) {
    if (phase !== 'playing') return
    hitsRef.current += 1
    setHits(h => h + 1)
    setTargets(prev => prev.filter(t => t.id !== id))
    if (navigator.vibrate) navigator.vibrate(20)
  }

  function missClick() {
    if (phase !== 'playing') return
    missesRef.current += 1
    setMisses(m => m + 1)
  }

  const accuracy = (hits + misses) > 0
    ? Math.round((hits / (hits + misses)) * 100)
    : 0

  const grade = score >= 80 ? 'Lightning Fast' : score >= 50 ? 'Good Speed' : 'Keep Practicing'
  const gradeEmoji = score >= 80 ? 'Fast!' : score >= 50 ? 'Good' : 'Keep Going'
  const ringColor = '#FFB000'

  if (phase === 'ready') {
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
          <div style={{
            fontSize: '52px',
            marginBottom: '16px',
            color: '#FFB000',
            fontWeight: 800,
          }}>
            GO
          </div>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            fontWeight: 600,
            color: '#1C2B3A',
            marginBottom: '8px',
          }}>
            Speed Sort
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
            Processing Speed
          </div>
          <div style={{
            background: '#EDF3F0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '28px',
            textAlign: 'left',
          }}>
            <div style={{
              fontSize: '13px',
              color: '#5C7A6B',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              How to play
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
              Tap the circles as fast as you can before they disappear.
              Each circle only lasts about 1 second.
              Score as many hits as possible in 60 seconds.
            </div>
          </div>
          <button onClick={startGame} style={{
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
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const ringDeg = score * 3.6
    const ringStyle = 'conic-gradient(' + ringColor + ' ' + ringDeg + 'deg, #E0E0E0 0deg)'
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
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#FFB000',
            marginBottom: '12px',
          }}>
            {gradeEmoji}
          </div>
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
            Speed Sort
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
                {score + '%'}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>score</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Hits', value: hits },
              { label: 'Accuracy', value: accuracy + '%' },
              { label: 'Misses', value: misses },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1,
                background: '#EDF3F0',
                borderRadius: '14px',
                padding: '12px 8px',
              }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B3A' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={startGame} style={{
              flex: 1,
              background: 'transparent',
              color: '#5C7A6B',
              border: '1.5px solid #5C7A6B',
              borderRadius: '50px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}>
              Play Again
            </button>
            <button onClick={() => navigate('/train')} style={{
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
              All Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={missClick}
      style={{
        minHeight: '100vh',
        background: '#1C2B3A',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '48px 24px 0',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#FAF7F2' }}>
          {'Hits: ' + hits}
        </div>
        <div style={{
          background: timeLeft <= 10 ? '#C4714A' : '#5C7A6B',
          color: '#FAF7F2',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '15px',
          fontWeight: 700,
          minWidth: '52px',
          textAlign: 'center',
          transition: 'background 0.3s',
        }}>
          {timeLeft + 's'}
        </div>
        <div style={{ fontSize: '14px', color: '#8FAF9F' }}>
          {'Acc: ' + accuracy + '%'}
        </div>
      </div>
      {targets.map(target => (
        <button
          key={target.id}
          onClick={e => { e.stopPropagation(); hitTarget(target.id) }}
          style={{
            position: 'absolute',
            left: target.x + '%',
            top: target.y + '%',
            width: target.size,
            height: target.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #8FAF9F, #5C7A6B)',
            border: '3px solid #FAF7F2',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          +
        </button>
      ))}
    </div>
  )
}

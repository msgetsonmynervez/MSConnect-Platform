import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../../lib/supabase'

const EXERCISE_ID = 'cad27415-9afd-4d19-b88b-7e20f933421b'
const GAME_DURATION = 60

const EMOJIS = ['🌿', '🧠', '💙', '⭐', '🌸', '🎯', '🔥', '🌊']

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeCards(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS]
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }))
}

export default function MemoryMatch() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [cards, setCards] = useState<Card[]>(makeCards())
  const [selected, setSelected] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lockRef = useRef(false)

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
    setCards(makeCards())
    setSelected([])
    setMatches(0)
    setAttempts(0)
    setTimeLeft(GAME_DURATION)
    setPhase('playing')
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (phase === 'done') {
      endGame()
    }
  }, [phase])

  async function endGame() {
    if (timerRef.current) clearInterval(timerRef.current)
    const finalScore = Math.round((matches / EMOJIS.length) * 100) / 100
    setScore(Math.round(finalScore * 100))
    if (sessionId && userId) {
      await supabase.from('training_sessions').update({
        status: 'completed',
        duration_seconds: GAME_DURATION - timeLeft,
        score_normalized: finalScore,
      }).eq('id', sessionId)
      await supabase.rpc('recalculate_streak', { p_user_id: userId })
    }
    if (navigator.vibrate) navigator.vibrate([40, 30, 40])
  }

  function flipCard(id: number) {
    if (lockRef.current) return
    if (phase !== 'playing') return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (selected.length === 1 && selected[0] === id) return

    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c)
    setCards(newCards)

    if (selected.length === 0) {
      setSelected([id])
      return
    }

    const firstId = selected[0]
    const first = newCards.find(c => c.id === firstId)!
    const second = newCards.find(c => c.id === id)!
    setAttempts(a => a + 1)
    lockRef.current = true

    if (first.emoji === second.emoji) {
      const matched = newCards.map(c =>
        c.id === firstId || c.id === id ? { ...c, matched: true } : c
      )
      setCards(matched)
      const newMatches = matches + 1
      setMatches(newMatches)
      setSelected([])
      lockRef.current = false
      if (newMatches === EMOJIS.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setPhase('done')
      }
    } else {
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === id ? { ...c, flipped: false } : c
        ))
        setSelected([])
        lockRef.current = false
      }, 900)
    }
  }

  const accuracy = attempts > 0 ? Math.round((matches / attempts) * 100) : 0

  if (phase === 'ready') {
    return (
      <div style={{
        minHeight: '100vh', background: '#1C2B3A',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{
          background: '#FAF7F2', borderRadius: '24px',
          padding: '40px 28px', width: '100%', maxWidth: '400px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🧠</div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '24px',
            fontWeight: 600, color: '#1C2B3A', marginBottom: '8px',
          }}>Memory Match</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
            Working Memory
          </div>
          <div style={{
            background: '#EDF3F0', borderRadius: '16px',
            padding: '16px', marginBottom: '28px', textAlign: 'left',
          }}>
            <div style={{ fontSize: '13px', color: '#5C7A6B', fontWeight: 600, marginBottom: '8px' }}>
              How to play
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
              Flip cards to find matching pairs. Remember where each card is.
              Match all 8 pairs as fast as you can in 60 seconds.
            </div>
          </div>
          <button onClick={startGame} style={{
            background: '#1C2B3A', color: '#FAF7F2', border: 'none',
            borderRadius: '50px', padding: '18px', fontSize: '16px',
            fontWeight: 600, cursor: 'pointer', width: '100%',
          }}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const grade = score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : 'Keep Going'
    const gradeEmoji = score >= 80 ? '🌟' : score >= 50 ? '💪' : '🌱'
    return (
      <div style={{
        minHeight: '100vh', background: '#1C2B3A',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{
          background: '#FAF7F2', borderRadius: '24px',
          padding: '40px 28px', width: '100%', maxWidth: '400px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>{gradeEmoji}</div>
          <div style={{
            fontFamily: 'Georgia, serif', fontSize: '24px',
            fontWeight: 600, color: '#1C2B3A', marginBottom: '4px',
          }}>{grade}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '28px' }}>
            Memory Match
          </div>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'conic-gradient(#5C7A6B ' + score * 3.6 + 'deg, #E0E0E0 0deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
          }}>
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              background: '#FAF7F2', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C2B3A' }}>{score}%</div>
              <div style={{ fontSize: '10px', color: '#6B7280' }}>score</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Pairs Found', value: matches + ' / ' + EMOJIS.length },
              { label: 'Accuracy', value: accuracy + '%' },
              { label: 'Attempts', value: attempts },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, background: '#EDF3F0', borderRadius: '14px', padding: '12px 8px',
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
              flex: 1, background: 'transparent', color: '#5C7A6B',
              border: '1.5px solid #5C7A6B', borderRadius: '50px',
              padding: '14px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}>
              Play Again
            </button>
            <button onClick={() => navigate('/train')} style={{
              flex: 1, background: '#1C2B3A', color: '#FAF7F2',
              border: 'none', borderRadius: '50px', padding: '14px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}>
              All Games
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', padding: '24px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px', paddingTop: '24px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#FAF7F2' }}>
          Memory Match
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', color: '#8FAF9F' }}>
            {matches} pairs
          </div>
          <div style={{
            background: timeLeft <= 10 ? '#C4714A' : '#5C7A6B',
            color: '#FAF7F2', borderRadius: '20px', padding: '6px 14px',
            fontSize: '15px', fontWeight: 700, minWidth: '52px', textAlign: 'center',
            transition: 'background 0.3s',
          }}>
            {timeLeft}s
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px', maxWidth: '400px', margin: '0 auto',
      }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            style={{
              aspectRatio: '1',
              borderRadius: '14px',
              border: 'none',
              background: card.flipped || card.matched ? '#FAF7F2' : '#2E4057',
              fontSize: card.flipped || card.matched ? '28px' : '0px',
              cursor: card.matched ? 'default' : 'pointer',
              transition: 'all 0.25s',
              opacity: card.matched ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: card.flipped && !card.matched ? '0 0 0 2px #5C7A6B' : 'none',
            }}
          >
            {card.flipped || card.matched ? card.emoji : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'

type DayTag = 'good' | 'hard' | null

interface CheckinForm {
  energy_level: number
  mood_score: number
  symptom_flags: string[]
  free_text_note: string
  day_tag: DayTag
}

const SYMPTOMS = [
  'Fatigue', 'Pain', 'Numbness', 'Balance', 'Vision',
  'Memory', 'Spasticity', 'Tremor', 'Bladder', 'Mood'
]

const DEFAULT_FORM: CheckinForm = {
  energy_level: 3, mood_score: 3,
  symptom_flags: [], free_text_note: '', day_tag: null,
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: i < current ? '#5C7A6B' : i === current ? '#1C2B3A' : '#E0E0E0',
            transform: i === current ? 'scale(1.2)' : 'scale(1)',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
      <span style={{ fontSize: '12px', color: '#6B7280' }}>{current + 1} of {total}</span>
    </div>
  )
}

function SliderField({ label, value, onChange, lowLabel, highLabel }: {
  label: string; value: number; onChange: (v: number) => void
  lowLabel: string; highLabel: string
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 500, color: '#1C2B3A' }}>{label}</label>
        <span style={{ background: '#1C2B3A', color: '#FAF7F2', borderRadius: '20px', padding: '2px 12px', fontSize: '13px', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        {[1,2,3,4,5].map(val => {
          const selected = val === value
          return (
            <button key={val} onClick={() => onChange(val)} style={{
              flex: 1, padding: '14px 0', borderRadius: '12px', border: 'none',
              background: selected ? '#1C2B3A' : '#F0EDE8',
              color: selected ? '#FAF7F2' : '#6B7280',
              fontSize: '15px', fontWeight: selected ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s',
              transform: selected ? 'scale(1.05)' : 'scale(1)'
            }}>{val}</button>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>{lowLabel}</span>
        <span style={{ fontSize: '11px', color: '#6B7280' }}>{highLabel}</span>
      </div>
    </div>
  )
}

// Confetti particle
function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  const particles = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#5C7A6B','#C4714A','#D4A843','#648FFF','#8FAF9F'][i % 5],
    size: 6 + Math.random() * 6,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 500, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: '-10px',
          width: p.size, height: p.size, borderRadius: '2px',
          background: p.color,
          animation: `fall 1.4s ease-in ${p.delay}s forwards`,
        }} />
      ))}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function DailyCheckIn() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CheckinForm>(DEFAULT_FORM)
  const [showNotes, setShowNotes] = useState(false)
  const [prefilled, setPrefilled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)

      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const [existing, prev, streakData] = await Promise.all([
        supabase.from('daily_checkins').select('*').eq('user_id', user.id).eq('checkin_date', today).maybeSingle(),
        supabase.from('daily_checkins').select('energy_level,mood_score,symptom_flags').eq('user_id', user.id).eq('checkin_date', yesterdayStr).maybeSingle(),
        supabase.from('training_streaks').select('current_streak_days').eq('user_id', user.id).maybeSingle(),
      ])

      setCurrentStreak(streakData.data?.current_streak_days ?? 0)

      if (existing.data) {
        setForm({
          energy_level: existing.data.energy_level,
          mood_score: existing.data.mood_score,
          symptom_flags: existing.data.symptom_flags ?? [],
          free_text_note: existing.data.free_text_note ?? '',
          day_tag: existing.data.day_tag ?? null,
        })
      } else if (prev.data) {
        setForm(f => ({
          ...f,
          energy_level: prev.data!.energy_level,
          mood_score: prev.data!.mood_score,
          symptom_flags: prev.data!.symptom_flags ?? [],
        }))
        setPrefilled(true)
      }
      setLoading(false)
    }
    init()
  }, [navigate])

  function updateForm(key: keyof CheckinForm, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleSymptom(symptom: string) {
    setForm(f => ({
      ...f,
      symptom_flags: f.symptom_flags.includes(symptom)
        ? f.symptom_flags.filter(s => s !== symptom)
        : [...f.symptom_flags, symptom]
    }))
  }

  function startVoice() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice input is not supported on this browser.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setForm(f => ({ ...f, free_text_note: f.free_text_note ? f.free_text_note + ' ' + transcript : transcript }))
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  async function handleSubmit() {
    if (!userId) return
    setSubmitting(true)
    setError('')

    const today = new Date().toISOString().split('T')[0]
    const { error: err } = await supabase.from('daily_checkins').upsert({
      user_id: userId,
      checkin_date: today,
      energy_level: form.energy_level,
      mood_score: form.mood_score,
      symptom_flags: form.symptom_flags,
      free_text_note: form.free_text_note || null,
      day_tag: form.day_tag,
    }, { onConflict: 'user_id,checkin_date' })

    if (err) {
      setError('Something went wrong saving your check-in. Please try again.')
      setSubmitting(false)
      return
    }

    await supabase.rpc('check_symptom_pattern', { p_user_id: userId })

    // Haptic feedback #94
    if (navigator.vibrate) navigator.vibrate([40, 30, 40])

    // Confetti on streak milestone #96
    const milestones = [3, 7, 14, 21, 30, 60, 90]
    if (milestones.includes(currentStreak + 1)) {
      setShowConfetti(true)
      setTimeout(() => { setShowConfetti(false); navigate('/home') }, 2000)
    } else {
      navigate('/home')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#FAF7F2', fontFamily: 'Georgia, serif', fontSize: '18px' }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <Confetti active={showConfetti} />
      <div style={{ background: '#FAF7F2', borderRadius: '24px', padding: '36px 28px', width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#1C2B3A' }}>Daily Check-in</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <StepIndicator current={step} total={3} />
        </div>

        {prefilled && step === 0 && (
          <div style={{ background: '#EDF3F0', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: '#5C7A6B', textAlign: 'center' }}>
            Pre-filled from yesterday — adjust as needed
          </div>
        )}

        {step === 0 && (
          <div>
            <SliderField label="Energy Level" value={form.energy_level} onChange={v => updateForm('energy_level', v)} lowLabel="Exhausted" highLabel="Energised" />
            <SliderField label="Mood" value={form.mood_score} onChange={v => updateForm('mood_score', v)} lowLabel="Low" highLabel="Great" />
            <button style={btnStyle} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <p style={{ fontSize: '14px', color: '#1C2B3A', fontWeight: 500, marginBottom: '16px' }}>
              Any symptoms today? <span style={{ color: '#6B7280', fontWeight: 400 }}>(tap all that apply)</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {SYMPTOMS.map(s => {
                const active = form.symptom_flags.includes(s)
                return (
                  <button key={s} onClick={() => toggleSymptom(s)} style={{
                    padding: '10px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 500,
                    border: `2px solid ${active ? '#1C2B3A' : '#E0E0E0'}`,
                    background: active ? '#1C2B3A' : '#FFFFFF',
                    color: active ? '#FAF7F2' : '#6B7280',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}>{s}</button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={backStyle} onClick={() => setStep(0)}>← Back</button>
              <button style={{ ...btnStyle, flex: 1 }} onClick={() => setStep(2)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: '14px', color: '#1C2B3A', fontWeight: 500, marginBottom: '16px' }}>How would you tag today?</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {(['good', 'hard'] as const).map(tag => (
                <button key={tag} onClick={() => updateForm('day_tag', form.day_tag === tag ? null : tag)} style={{
                  flex: 1, padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 500,
                  border: `2px solid ${form.day_tag === tag ? (tag === 'good' ? '#5C7A6B' : '#3b82f6') : '#E0E0E0'}`,
                  background: form.day_tag === tag ? (tag === 'good' ? '#EDF3F0' : '#EFF6FF') : '#FFFFFF',
                  color: form.day_tag === tag ? (tag === 'good' ? '#5C7A6B' : '#3b82f6') : '#6B7280',
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                }}>
                  {tag === 'good' ? '🌿 Good Day' : '💙 Hard Day'}
                </button>
              ))}
            </div>

            {!showNotes ? (
              <button onClick={() => setShowNotes(true)} style={{
                background: 'none', border: 'none', color: '#5C7A6B', fontSize: '13px',
                fontWeight: 500, cursor: 'pointer', padding: '0 0 20px 0', display: 'block'
              }}>+ Add notes (optional)</button>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={form.free_text_note}
                    onChange={e => updateForm('free_text_note', e.target.value)}
                    placeholder="How are you feeling? Anything to note..."
                    rows={4}
                    style={{
                      width: '100%', padding: '14px 48px

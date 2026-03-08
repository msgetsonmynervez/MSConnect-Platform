import { useEffect, useState } from 'react'
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
  energy_level: 3,
  mood_score: 3,
  symptom_flags: [],
  free_text_note: '',
  day_tag: null,
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

function SliderField({
  label, value, onChange, min = 1, max = 5, lowLabel, highLabel
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  lowLabel: string
  highLabel: string
}) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: 500, color: '#1C2B3A' }}>{label}</label>
        <span style={{
          background: '#1C2B3A', color: '#FAF7F2', borderRadius: '20px',
          padding: '2px 12px', fontSize: '13px', fontWeight: 600
        }}>{value}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const val = min + i
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

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)

      const today = new Date().toISOString().split('T')[0]

      // Check if already submitted today
      const { data: existing } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle()

      if (existing) {
        setForm({
          energy_level: existing.energy_level,
          mood_score: existing.mood_score,
          symptom_flags: existing.symptom_flags ?? [],
          free_text_note: existing.free_text_note ?? '',
          day_tag: existing.day_tag ?? null,
        })
        setLoading(false)
        return
      }

      // Smart defaults — fetch yesterday
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const { data: prev } = await supabase
        .from('daily_checkins')
        .select('energy_level, mood_score, symptom_flags')
        .eq('user_id', user.id)
        .eq('checkin_date', yesterdayStr)
        .maybeSingle()

      if (prev) {
        setForm(f => ({
          ...f,
          energy_level: prev.energy_level,
          mood_score: prev.mood_score,
          symptom_flags: prev.symptom_flags ?? [],
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

  async function handleSubmit() {
    if (!userId) return
    setSubmitting(true)
    setError('')

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('daily_checkins')
      .upsert({
        user_id: userId,
        checkin_date: today,
        energy_level: form.energy_level,
        mood_score: form.mood_score,
        symptom_flags: form.symptom_flags,
        free_text_note: form.free_text_note || null,
        day_tag: form.day_tag,
      }, { onConflict: 'user_id,checkin_date' })

    if (error) {
      setError('Something went wrong saving your check-in. Please try again.')
      setSubmitting(false)
      return
    }

    navigate('/home')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1C2B3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FAF7F2', fontFamily: 'Georgia, serif', fontSize: '18px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#FAF7F2', borderRadius: '24px', padding: '36px 28px', width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#1C2B3A' }}>
            Daily Check-in
          </div>
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

        {/* Step 0 — Energy & Mood */}
        {step === 0 && (
          <div>
            <SliderField
              label="Energy Level"
              value={form.energy_level}
              onChange={v => updateForm('energy_level', v)}
              lowLabel="Exhausted"
              highLabel="Energised"
            />
            <SliderField
              label="Mood"
              value={form.mood_score}
              onChange={v => updateForm('mood_score', v)}
              lowLabel="Low"
              highLabel="Great"
            />
            <button style={btnStyle} onClick={() => setStep(1)}>Continue →</button>
          </div>
        )}

        {/* Step 1 — Symptoms */}
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

        {/* Step 2 — Day tag + notes + submit */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '14px', color: '#1C2B3A', fontWeight: 500, marginBottom: '16px' }}>
              How would you tag today?
            </p>
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

            {!showNotes && (
              <button onClick={() => setShowNotes(true)} style={{
                background: 'none', border: 'none', color: '#5C7A6B', fontSize: '13px',
                fontWeight: 500, cursor: 'pointer', padding: '0 0 20px 0', display: 'block'
              }}>+ Add notes (optional)</button>
            )}

            {showNotes && (
              <textarea
                value={form.free_text_note}
                onChange={e => updateForm('free_text_note', e.target.value)}
                placeholder="How are you feeling? Anything to note..."
                rows={4}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  border: '1.5px solid #E0E0E0', fontSize: '14px', color: '#2C2C2C',
                  resize: 'none', outline: 'none', marginBottom: '20px',
                  fontFamily: 'inherit', background: '#FFFFFF'
                }}
              />
            )}

            {error && (
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={backStyle} onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...btnStyle, flex: 1, opacity: submitting ? 0.7 : 1 }}
                onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Check-in ✓'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: '#1C2B3A', color: '#FAF7F2', border: 'none',
  borderRadius: '50px', padding: '16px', fontSize: '15px',
  fontWeight: 500, cursor: 'pointer', width: '100%',
  textAlign: 'center', marginTop: '4px'
}

const backStyle: React.CSSProperties = {
  background: 'transparent', color: '#6B7280',
  border: '1.5px solid #E0E0E0', borderRadius: '50px',
  padding: '16px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
}

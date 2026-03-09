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
            width: '10px',
            height: '10px',
            borderRadius: '50%',
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
  label: string
  value: number
  onChange: (v: number) => void
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
        {[1, 2, 3, 4, 5].map(val => {
          const selected = val === value
          return (
            <button key={val} onClick={() => onChange(val)} style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: '12px',
              border: 'none',
              background: selected ? '#1C2B3A' : '#F0EDE8',
              color: selected ? '#FAF7F2' : '#6B7280',
              fontSize: '15px',
              fontWeight: selected ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
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

function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  const particles = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#5C7A6B', '#C4714A', '#D4A843', '#648FFF', '#8FAF9F'][i % 5],
    size: 6 + Math.random() * 6,
  }))
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      zIndex: 500, overflow: 'hidden'
    }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.x + '%',
          top: '-10px',
          width: p.size,
          height: p.size,
          borderRadius: '2px',
          background: p.color,
          animation: 'fall 1.4s ease-in ' + p.delay + 's forwards',
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

      const today = new Date().​​​​​​​​​​​​​​​​

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

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

export default function Train() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserName(user.display_name || '')

      const { data } = await supabase
        .from('training_exercises')
        .select('id, name, cognitive_domain, difficulty_levels, icon_emoji, description')
        .eq('is_active', true)
        .order('sort_order')

      setExercises(data ?? [])
      setLoading(false)
    }
    load()
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <div style={{ padding: '48px 20px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 600, color: '#FAF7F2', marginBottom: '4px' }}>
          Train
        </div>
        <div style={{ fontSize: '14px', color: '#8FAF9F' }}>
          Keep your mind sharp, one session at a time
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading exercises...</div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {exercises.map(ex => (
          <button key={ex.id} onClick={() => {}} style={{
            background: '#FAF7F2', borderRadius: '20px', padding: '20px',
            border: 'none', cursor: 'pointer', textAlign: 'left',
            width: '100%', transition: 'transform 0.2s',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: '#EDF3F0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '28px', flexShrink: 0
            }}>
              {ex.icon_emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A', marginBottom: '4px' }}>
                {ex.name}
              </div>
              <div style={{ fontSize: '12px', color: '#5C7A6B', fontWeight: 500, marginBottom: '6px' }}>
                {DOMAIN_LABELS[ex.cognitive_domain] ?? ex.cognitive_domain}
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.4 }}>
                {ex.description}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: '#C4714A', flexShrink: 0 }}>›</div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

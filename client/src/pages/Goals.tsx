import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'

interface Goal {
  goal_type: string
  target_count: number
  week_of: string
  current: number
}

function getWeekOf(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  const iso = monday.toISOString()
  const parts = iso.split('T')
  return parts[0]
}

const GOAL_TYPES = [
  { type: 'checkins', label: 'Daily Check-ins', emoji: '✅', max: 7 },
  { type: 'training', label: 'Training Sessions', emoji: '🧠', max: 14 },
  { type: 'good_days', label: 'Good Days Tagged', emoji: '🌿', max: 7 },
]

export default function Goals() {
  const navigate = useNavigate()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const weekOf = getWeekOf()

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)

      const { data: goalRows } = await supabase
        .from('user_goals')
        .select('goal_type, target_count, week_of')
        .eq('user_id', user.id)
        .eq('week_of', weekOf)

      const [checkinRes, trainingRes, goodDayRes] = await Promise.all([
        supabase
          .from('daily_checkins')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('checkin_date', weekOf),
        supabase
          .from('training_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('started_at', weekOf),
        supabase
          .from('daily_checkins')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('day_tag', 'good')
          .gte('checkin_date', weekOf),
      ])

      const counts: Record<string, number> = {
        checkins: checkinRes.count ?? 0,
        training: trainingRes.count ?? 0,
        good_days: goodDayRes.count ?? 0,
      }

      const merged = GOAL_TYPES.map(gt => {
        const existing = (goalRows ?? []).find(g => g.goal_type === gt.type)
        return {
          goal_type: gt.type,
          target_count: existing ? existing.target_count : 3,
          week_of: weekOf,
          current: counts[gt.type] ?? 0,
        }
      })

      setGoals(merged)
      setLoading(false)
    }
    load()
  }, [navigate])

  async function updateTarget(goal_type: string, target: number) {
    if (!userId) return
    setSaving(goal_type)
    await supabase
      .from('user_goals')
      .upsert({
        user_id: userId,
        goal_type,
        target_count: target,
        week_of: weekOf,
      }, { onConflict: 'user_id,goal_type,week_of' })
    setGoals(gs => gs.map(g =>
      g.goal_type === goal_type ? { ...g, target_count: target } : g
    ))
    setSaving(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="Goals" subtitle="This week's targets" />

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading...</div>
      )}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <div style={{ background: '#FAF7F2', borderRadius: '20px', padding: '16px 20px' }}>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Week of</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C2B3A' }}>
            {new Date(weekOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
        </div>

        {goals.map(goal => {
          const meta = GOAL_TYPES.find(g => g.type === goal.goal_type)
          if (!meta) return null
          const pct = Math.min(1, goal.current / Math.max(1, goal.target_count))
          const done = goal.current >= goal.target_count
          const barColor = done ? '#5C7A6B' : '#C4714A'
          const pctNum = Math.round(pct * 100)
          return (
            <div key={goal.goal_type} style={{
              background: '#FAF7F2', borderRadius: '20px', padding: '20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{meta.emoji}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A' }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                      {goal.current} of {goal.target_count} {done ? '✅' : ''}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '22px', fontWeight: 700,
                  color: done ? '#5C7A6B' : '#1C2B3A',
                }}>
                  {pctNum}%
                </div>
              </div>

              <div style={{
                background: '#F0EDE8', borderRadius: '50px',
                height: '8px', marginBottom: '16px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '8px', borderRadius: '50px',
                  background: barColor,
                  width: pctNum + '%',
                  transition: 'width 0.4s ease',
                }} />
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                  Weekly target
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Array.from({ length: meta.max }, (_, i) => i + 1).map(n => {
                    const sel = n === goal.target_count
                    return (
                      <button
                        key={n}
                        onClick={() => updateTarget(goal.goal_type, n)}
                        disabled={saving === goal.goal_type}
                        style={{
                          flex: 1, padding: '8px 0', borderRadius: '8px', border: 'none',
                          background: sel ? '#1C2B3A' : '#F0EDE8',
                          color: sel ? '#FAF7F2' : '#6B7280',
                          fontSize: '13px', fontWeight: sel ? 600 : 400,
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >{n}</button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}

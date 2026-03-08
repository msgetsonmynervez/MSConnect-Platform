import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CheckIn {
  checkin_date: string
  energy_level: number
  mood_score: number
  day_tag: string | null
}

export default function Progress() {
  const navigate = useNavigate()
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0]

      const { data } = await supabase
        .from('daily_checkins')
        .select('checkin_date, energy_level, mood_score, day_tag')
        .eq('user_id', user.id)
        .gte('checkin_date', fromDate)
        .order('checkin_date', { ascending: true })

      setCheckins(data ?? [])
      setLoading(false)
    }
    load()
  }, [navigate])

  const chartData = checkins.map(c => ({
    date: new Date(c.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Energy: c.energy_level,
    Mood: c.mood_score,
  }))

  const avgEnergy = checkins.length
    ? (checkins.reduce((sum, c) => sum + c.energy_level, 0) / checkins.length).toFixed(1)
    : '—'

  const avgMood = checkins.length
    ? (checkins.reduce((sum, c) => sum + c.mood_score, 0) / checkins.length).toFixed(1)
    : '—'

  const goodDays = checkins.filter(c => c.day_tag === 'good').length
  const hardDays = checkins.filter(c => c.day_tag === 'hard').length

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <div style={{ padding: '48px 20px 24px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 600, color: '#FAF7F2', marginBottom: '4px' }}>
          Progress
        </div>
        <div style={{ fontSize: '14px', color: '#8FAF9F' }}>
          Your last 30 days
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '40px' }}>Loading...</div>
      )}

      {!loading && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Avg Energy', value: avgEnergy, emoji: '⚡' },
              { label: 'Avg Mood', value: avgMood, emoji: '😊' },
              { label: 'Good Days', value: goodDays, emoji: '🌿' },
              { label: 'Hard Days', value: hardDays, emoji: '💙' },
            ].map(stat => (
              <div key={stat.label} style={{
                flex: 1, background: '#FAF7F2', borderRadius: '16px',
                padding: '14px 8px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{stat.emoji}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C2B3A' }}>{stat.value}</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px', lineHeight: 1.3 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{ background: '#FAF7F2', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '16px' }}>
              Energy & Mood — 30 Days
            </div>
            {checkins.length < 2 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
                  Check in daily to see your trends appear here.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Energy" stroke="#FFB000" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="6 3" />
                  <Line type="monotone" dataKey="Mood" stroke="#648FFF" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Check-in history */}
          <div style={{ background: '#FAF7F2', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '16px' }}>
              Recent Check-ins
            </div>
            {checkins.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', padding: '16px 0' }}>
                No check-ins yet. Start your first one today.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...checkins].reverse().slice(0, 7).map(c => (
                  <div key={c.checkin_date} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '10px 0',
                    borderBottom: '1px solid #F0EDE8'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
                        {new Date(c.checkin_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      {c.day_tag && (
                        <div style={{
                          fontSize: '11px', marginTop: '2px',
                          color: c.day_tag === 'good' ? '#5C7A6B' : '#3b82f6'
                        }}>
                          {c.day_tag === 'good' ? '🌿 Good Day' : '💙 Hard Day'}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B3A' }}>{c.energy_level}</div>
                        <div style={{ fontSize: '10px', color: '#6B7280' }}>Energy</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C2B3A' }}>{c.mood_score}</div>
                        <div style={{ fontSize: '10px', color: '#6B7280' }}>Mood</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      <BottomNav />
    </div>
  )
}

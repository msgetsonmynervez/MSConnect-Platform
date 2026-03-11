import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'
import FogView from '../components/FogView'
import { useEnergy } from '../context/EnergyContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface CheckIn {
  checkin_date: string
  energy_level: number
  mood_score: number
  day_tag: string | null
  symptom_flags: string[]
}

interface TrainingSession {
  started_at: string
  score_normalized: number
  duration_seconds: number
  status: string
}

export default function Progress() {
  const navigate = useNavigate()
  const { fogMode } = useEnergy()
  const [checkins, setCheckins] = useState<CheckIn[]>([])
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  
  // Data Narrator State
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserProfile(user)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0]
      const [checkinResult, sessionResult] = await Promise.all([
        supabase.from('daily_checkins')
          .select('checkin_date, energy_level, mood_score, day_tag, symptom_flags')
          .eq('user_id', user.id)
          .gte('checkin_date', fromDate)
          .order('checkin_date', { ascending: true }),
        supabase.from('training_sessions')
          .select('started_at, score_normalized, duration_seconds, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('started_at', thirtyDaysAgo.toISOString())
          .order('started_at', { ascending: false })
      ])
      setCheckins(checkinResult.data ?? [])
      setSessions(sessionResult.data ?? [])
      setLoading(false)
    }
    load()

    // Cleanup: Stop talking if the user navigates away from the Progress page
    return () => {
      window.speechSynthesis.cancel();
    }
  }, [navigate])

  // --- LOCAL DATA NARRATOR ENGINE ---
  const toggleNarrator = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const recent7 = [...checkins].reverse().slice(0, 7);
    if (recent7.length === 0) {
      speak("You don't have any check-ins yet. Start tracking to hear your weekly summary.");
      return;
    }

    // Calculate 7-day averages for the audio brief
    const avgE = (recent7.reduce((s, c) => s + c.energy_level, 0) / recent7.length).toFixed(1);
    const avgM = (recent7.reduce((s, c) => s + c.mood_score, 0) / recent7.length).toFixed(1);
    const good = recent7.filter(c => c.day_tag === 'good').length;
    const hard = recent7.filter(c => c.day_tag === 'hard').length;

    let text = `Here is your summary for the last ${recent7.length} check-ins. `;
    text += `Your average energy was ${avgE}, and your average mood was ${avgM}. `;
    if (good > 0) text += `You recorded ${good} good ${good === 1 ? 'day' : 'days'}. `;
    if (hard > 0) text += `You recorded ${hard} hard ${hard === 1 ? 'day' : 'days'}. `;
    text += "Thank you for tracking. You are doing a great job.";

    speak(text);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Clear any queued speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Slow the rate slightly for better cognitive accessibility (Brain Fog buffer)
    utterance.rate = 0.9; 
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  async function generateReport() {
    if (!userProfile) return
    setExporting(true)
    try {
      const doc = new jsPDF()
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      doc.setFontSize(22)
      doc.setTextColor(28, 43, 58)
      doc.text('MSConnect', 20, 20)
      doc.setFontSize(12)
      doc.setTextColor(107, 114, 128)
      doc.text('Patient Progress Report', 20, 28)
      doc.text(`Generated: ${today}`, 20, 35)
      doc.setFontSize(14)
      doc.setTextColor(28, 43, 58)
      doc.text('Patient Information', 20, 50)
      doc.setFontSize(11)
      doc.setTextColor(44, 44, 44)
      doc.text(`Name: ${userProfile.display_name}`, 20, 60)
      doc.text(`MS Type: ${userProfile.ms_type?.toUpperCase() ?? 'Not specified'}`, 20, 68)
      if (userProfile.diagnosis_year) doc.text(`Diagnosis Year: ${userProfile.diagnosis_year}`, 20, 76)
      const avgEnergy = checkins.length ? (checkins.reduce((s, c) => s + c.energy_level, 0) / checkins.length).toFixed(1) : 'N/A'
      const avgMood = checkins.length ? (checkins.reduce((s, c) => s + c.mood_score, 0) / checkins.length).toFixed(1) : 'N/A'
      const goodDays = checkins.filter(c => c.day_tag === 'good').length
      const hardDays = checkins.filter(c => c.day_tag === 'hard').length
      const avgScore = sessions.length ? (sessions.reduce((s, t) => s + Number(t.score_normalized), 0) / sessions.length * 100).toFixed(0) : 'N/A'
      doc.setFontSize(14)
      doc.setTextColor(28, 43, 58)
      doc.text('30-Day Summary', 20, 95)
      ;(doc as any).autoTable({
        startY: 100,
        head: [['Metric', 'Value']],
        body: [
          ['Check-ins completed', checkins.length],
          ['Average energy level (1-5)', avgEnergy],
          ['Average mood score (1-5)', avgMood],
          ['Good days tagged', goodDays],
          ['Hard days tagged', hardDays],
          ['Training sessions completed', sessions.length],
          ['Average training score', avgScore === 'N/A' ? 'N/A' : `${avgScore}%`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [28, 43, 58] },
        styles: { fontSize: 10 },
      })
      if (checkins.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY + 15
        doc.setFontSize(14)
        doc.setTextColor(28, 43, 58)
        doc.text('Daily Check-in History', 20, finalY)
        ;(doc as any).autoTable({
          startY: finalY + 5,
          head: [['Date', 'Energy', 'Mood', 'Day Tag', 'Symptoms']],
          body: checkins.map(c => [
            new Date(c.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            c.energy_level, c.mood_score, c.day_tag ?? '—',
            c.symptom_flags?.join(', ') || 'None'
          ]),
          theme: 'striped',
          headStyles: { fillColor: [92, 122, 107] },
          styles: { fontSize: 9 },
        })
      }
      doc.save(`msconnect-report-${today.replace(/,?\s/g, '-')}.pdf`)
    } catch (e) { console.error('Export error:', e) }
    setExporting(false)
  }

  const chartData = checkins.map(c => ({
    date: new Date(c.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Energy: c.energy_level, Mood: c.mood_score,
  }))
  const avgEnergy = checkins.length ? (checkins.reduce((sum, c) => sum + c.energy_level, 0) / checkins.length).toFixed(1) : '—'
  const avgMood = checkins.length ? (checkins.reduce((sum, c) => sum + c.mood_score, 0) / checkins.length).toFixed(1) : '—'
  const goodDays = checkins.filter(c => c.day_tag === 'good').length
  const hardDays = checkins.filter(c => c.day_tag === 'hard').length

  if (fogMode) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1C2B3A' }}>
        <FogView
          title="Your progress"
          primaryLabel={isSpeaking ? "Stop audio 🛑" : "Listen to summary 🔊"}
          onPrimary={toggleNarrator}
        />
        <BottomNav />
      </div>
    )
  }

  // Common Action Button Style for iPad (Split padding)
  const actionButtonStyle: React.CSSProperties = {
    borderStyle: 'none',
    borderRadius: '50px', 
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontSize: '13px', 
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1C2B3A', paddingBottom: '80px' }}>
      <div style={{ paddingTop: '48px', paddingBottom: '24px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#FAF7F2', marginBottom: '16px' }}>Progress</div>
        
        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Audio Narrator Button */}
          <button 
            onClick={toggleNarrator} 
            style={{
              ...actionButtonStyle,
              backgroundColor: isSpeaking ? '#C4714A' : '#8FAF9F', 
              color: '#1C2B3A',
            }}
          >
            {isSpeaking ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                Stop Briefing
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                Listen to Summary
              </>
            )}
          </button>

          {/* Export Button */}
          <button 
            onClick={generateReport} 
            disabled={exporting || checkins.length === 0} 
            style={{
              ...actionButtonStyle,
              backgroundColor: exporting ? '#2E4057' : '#5C7A6B', 
              color: '#FAF7F2', 
              opacity: checkins.length === 0 ? 0.5 : 1
            }}
          >
            {exporting ? 'Generating...' : '📄 Export PDF'}
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#8FAF9F', paddingTop: '40px', paddingBottom: '40px' }}>Loading...</div>}

      {!loading && (
        <div style={{ paddingLeft: '16px', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { label: 'Avg Energy', value: avgEnergy, emoji: '⚡' },
              { label: 'Avg Mood', value: avgMood, emoji: '😊' },
              { label: 'Good Days', value: goodDays, emoji: '🌿' },
              { label: 'Hard Days', value: hardDays, emoji: '💙' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, backgroundColor: '#FAF7F2', borderRadius: '16px', paddingTop: '14px', paddingBottom: '14px', paddingLeft: '8px', paddingRight: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{stat.emoji}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C2B3A' }}>{stat.value}</div>
                <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px', lineHeight: 1.3 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '20px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '16px' }}>Energy & Mood — 30 Days</div>
            {checkins.length < 2 ? (
              <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>Check in daily to see your trends appear here.</p>
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
          <div style={{ backgroundColor: '#FAF7F2', borderRadius: '20px', paddingTop: '20px', paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '16px' }}>Recent Check-ins</div>
            {checkins.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }}>No check-ins yet. Start your first one today.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...checkins].reverse().slice(0, 7).map(c => (
                  <div key={c.checkin_date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', paddingBottom: '10px', borderBottom: '1px solid #F0EDE8' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
                        {new Date(c.checkin_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      {c.day_tag && (
                        <div style={{ fontSize: '11px', marginTop: '2px', color: c.day_tag === 'good' ? '#5C7A6B' : '#3b82f6' }}>
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

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'

interface JournalEntry {
  id: string
  content: string
  created_at: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function Journal() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [writing, setWriting] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (!user) { navigate('/signin'); return }
      setUserId(user.id)
      const { data } = await supabase
        .from('journal_entries')
        .select('id, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30)
      setEntries(data ?? [])
      setLoading(false)
    }
    load()
  }, [navigate])

  async function saveEntry() {
    if (!userId || !draft.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ user_id: userId, content: draft.trim() })
      .select('id, content, created_at')
      .single()
    if (!error && data) {
      setEntries(e => [data, ...e])
      setDraft('')
      setWriting(false)
    }
    setSaving(false)
  }

  async function deleteEntry(id: string) {
    await supabase.from('journal_entries').delete().eq('id', id)
    setEntries(e => e.filter(x => x.id !== id))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="Journal" subtitle="Your private space" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {!writing ? (
          <button onClick={() => setWriting(true)} style={{
            background: '#FAF7F2', borderRadius: '20px', padding: '20px',
            border: 'none', cursor: 'pointer', textAlign: 'left',
            width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: '#EDF3F0', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
            }}>✏️</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C2B3A', marginBottom: '2px' }}>
                New Entry
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                What's on your mind today?
              </div>
            </div>
          </button>
        ) : (
          <div style={{ background: '#FAF7F2', borderRadius: '20px', padding: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '12px' }}>
              New Entry
            </div>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Write freely — this is just for you..."
              rows={6}
              autoFocus
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1.5px solid #E0E0E0',
                fontSize: '14px',
                color: '#2C2C2C',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => { setWriting(false); setDraft('') }}
                style={{
                  background: 'transparent', color: '#6B7280',
                  border: '1.5px solid #E0E0E0', borderRadius: '50px',
                  padding: '12px 20px', fontSize: '14px', cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                onClick={saveEntry}
                disabled={saving || !draft.trim()}
                style={{
                  flex: 1, background: '#1C2B3A', color: '#FAF7F2',
                  border: 'none', borderRadius: '50px', padding: '12px',
                  fontSize: '14px', fontWeight: 500,
                  cursor: saving || !draft.trim() ? 'not-allowed' : 'pointer',
                  opacity: saving || !draft.trim() ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', color: '#8FAF9F', padding: '24px' }}>Loading...</div>
        )}

        {!loading && entries.length === 0 && !writing && (
          <div style={{
            background: '#FAF7F2', borderRadius: '20px',
            padding: '40px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📖</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1C2B3A', marginBottom: '6px' }}>
              Your journal is empty
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
              Writing freely about your experience with MS can be surprisingly powerful.
            </div>
          </div>
        )}

        {entries.map(entry => {
          const isOpen = expanded === entry.id
          const preview = entry.content.slice(0, 120)
          const long = entry.content.length > 120
          return (
            <div key={entry.id} style={{
              background: '#FAF7F2', borderRadius: '20px', padding: '18px 20px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '10px',
              }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {formatDate(entry.created_at)}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  style={{
                    background: 'none', border: 'none', color: '#E0E0E0',
                    fontSize: '16px', cursor: 'pointer', padding: '0 0 0 12px',
                  }}
                >🗑️</button>
              </div>
              <p style={{ fontSize: '14px', color: '#2C2C2C', lineHeight: 1.7, margin: 0 }}>
                {isOpen ? entry.content : preview}
                {long && !isOpen ? '...' : ''}
              </p>
              {long && (
                <button
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{
                    background: 'none', border: 'none', color: '#5C7A6B',
                    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                    padding: '8px 0 0 0',
                  }}
                >
                  {isOpen ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          )
        })}

      </div>
      <BottomNav />
    </div>
  )
}

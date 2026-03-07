import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return
      const { data } = await supabase
        .from('users')
        .select('display_name, username, ms_type, current_streak_days')
        .eq('auth_id', authUser.id)
        .single()
      setUser(data)
    }
    loadUser()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--navy)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--cream)',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }} className="fade-up">
        <div style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '36px',
          fontWeight: 600,
          color: 'var(--navy)',
          marginBottom: '8px',
        }}>
          MS<span style={{ color: 'var(--sage)' }}>Connect</span>
        </div>

        {user && (
          <>
            <p style={{ fontSize: '20px', margin: '20px 0 8px', color: 'var(--navy)' }}>
              Welcome, {user.display_name} 🌿
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginBottom: '24px' }}>
              @{user.username} · {user.ms_type?.toUpperCase()}
            </p>
          </>
        )}

        <div style={{
          background: 'var(--sage-pale)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--sage)', fontWeight: 500 }}>
            🎉 Auth flow complete! Your account is set up and connected to Supabase.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '8px', lineHeight: 1.5 }}>
            The full app screens — training, community feed, and progress — are coming next.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            background: 'transparent',
            color: 'var(--text-soft)',
            border: '1.5px solid #E0E0E0',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

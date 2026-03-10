import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthConfirm() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenHash = params.get('token_hash')
    const type = params.get('type')
    if (tokenHash && type) {
      supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as 'email' | 'recovery' | 'invite' | 'magiclink',
      }).then(({ error: err }) => {
        if (err) {
          setError('This confirmation link has expired or already been used. Please request a new one.')
        } else {
          navigate('/home', { replace: true })
        }
      })
    } else {
      setError('Invalid confirmation link. Please try signing up again.')
    }
  }, [navigate])

  const wrapStyle: React.CSSProperties = { minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }
  const cardStyle: React.CSSProperties = { background: 'white', border: '1px solid #E0E0E0', borderRadius: '20px', padding: '48px 36px', maxWidth: '400px', width: '100%', textAlign: 'center' }
  const titleStyle: React.CSSProperties = { fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, color: 'var(--navy)', marginBottom: '12px' }
  const textStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '24px' }
  const errorStyle: React.CSSProperties = { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', marginBottom: '20px' }
  const btnStyle: React.CSSProperties = { display: 'inline-block', padding: '12px 28px', background: 'var(--sage)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
  const dotStyle: React.CSSProperties = { width: '32px', height: '32px', border: '3px solid var(--sage-pale)', borderTopColor: 'var(--sage)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }

  if (error !== '') {
    return (
      <div style={wrapStyle}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={cardStyle}>
          <div style={titleStyle}>Confirmation failed</div>
          <div style={errorStyle}>{error}</div>
          <button style={btnStyle} onClick={() => navigate('/signin')}>Back to sign in</button>
        </div>
      </div>
    )
  }

  return (
    <div style={wrapStyle}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={cardStyle}>
        <div style={dotStyle} />
        <div style={titleStyle}>Confirming your email</div>
        <div style={textStyle}>Just a moment...</div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn() {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    const result = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (result.error) {
      setError(result.error.message)
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  const btnStyle: React.CSSProperties = {
    background: '#1C2B3A',
    color: '#FAF7F2',
    border: 'none',
    borderRadius: '50px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '4px',
    opacity: loading ? 0.7 : 1,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C2B3A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <div style={{
        background: '#FAF7F2',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1,
      }}>

        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          fontWeight: 600,
          color: '#1C2B3A',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          MS
          <span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: 1.5,
        }}>
          Your daily companion for living well with MS
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoCapitalize="none"
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #E0E0E0',
                background: '#FFFFFF',
                fontSize: '15px',
                color: '#2C2C2C',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #E0E0E0',
                background: '#FFFFFF',
                fontSize: '15px',
                color: '#2C2C2C',
                outline: 'none',
              }}
            />
          </div>

          {error !== '' && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            style={btnStyle}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password" style={{
              color: '#5C7A6B',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              Forgot password?
            </Link>
          </div>

        </div>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#6B7280' }}>New to MSConnect? </span>
          <Link to="/signup" style={{
            color: '#5C7A6B',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
          }}>
            Create an account
          </Link>
        </div>

      </div>

      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(92,122,107,0.15)',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-60px',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'rgba(196,113,74,0.1)',
        zIndex: 0,
      }} />

    </div>
  )
}

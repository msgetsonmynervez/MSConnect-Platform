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
      setError('Please enter your email and password.'); 
      return 
    }
    setLoading(true)
    setError('')
    
    // Supabase handles session storage automatically in a secure way.
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    
    if (signInError) { 
      setError(signInError.message); 
      setLoading(false) 
    } else { 
      navigate('/home') 
    }
  }

  // Styles updated for iPad Safety (Split Padding)
  const btnStyle: React.CSSProperties = { 
    background: '#1C2B3A', 
    color: '#FAF7F2', 
    border: 'none', 
    borderRadius: '50px', 
    paddingTop: '16px', 
    paddingBottom: '16px', 
    paddingLeft: '24px', 
    paddingRight: '24px', 
    fontSize: '15px', 
    fontWeight: 500, 
    cursor: 'pointer', 
    marginTop: '4px', 
    opacity: loading ? 0.7 : 1 
  }

  const bannerStyle: React.CSSProperties = { 
    background: '#FDF5F0', 
    border: '1px solid rgba(196,113,74,0.25)', 
    borderRadius: '14px', 
    paddingTop: '14px', 
    paddingBottom: '14px', 
    paddingLeft: '18px', 
    paddingRight: '18px', 
    marginBottom: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: '12px' 
  }

  const bannerTextStyle: React.CSSProperties = { 
    fontSize: '13px', 
    color: '#6B7280', 
    lineHeight: 1.5, 
    flex: 1 
  }

  const bannerLinkStyle: React.CSSProperties = { 
    fontSize: '12px', 
    fontWeight: 600, 
    color: '#C4714A', 
    textDecoration: 'none', 
    whiteSpace: 'nowrap', 
    background: 'white', 
    border: '1px solid rgba(196,113,74,0.3)', 
    borderRadius: '8px', 
    paddingTop: '6px', 
    paddingBottom: '6px', 
    paddingLeft: '12px', 
    paddingRight: '12px', 
    flexShrink: 0 
  }

  const inputStyle: React.CSSProperties = { 
    paddingTop: '14px', 
    paddingBottom: '14px', 
    paddingLeft: '16px', 
    paddingRight: '16px', 
    borderRadius: '12px', 
    border: '1.5px solid #E0E0E0', 
    background: '#FFFFFF', 
    fontSize: '16px', // 16px prevents iOS auto-zoom on focus
    color: '#2C2C2C', 
    outline: 'none' 
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1C2B3A', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingTop: '24px', 
      paddingBottom: '24px', 
      paddingLeft: '24px', 
      paddingRight: '24px', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <div style={{ 
        background: '#FAF7F2', 
        borderRadius: '24px', 
        paddingTop: '40px', 
        paddingBottom: '40px', 
        paddingLeft: '32px', 
        paddingRight: '32px', 
        width: '100%', 
        maxWidth: '400px', 
        position: 'relative', 
        zIndex: 1 
      }}>

        <div style={bannerStyle}>
          <p style={bannerTextStyle}>New here? MSConnect is built for people living with MS. Help shape what we build next.</p>
          <Link to="/survey" style={bannerLinkStyle}>Take the survey</Link>
        </div>

        <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 600, color: '#1C2B3A', marginBottom: '8px', textAlign: 'center' }}>
          MS<span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '32px', lineHeight: 1.5 }}>
          Your daily companion for living well with MS
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              autoCapitalize="none" 
              style={inputStyle} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>Password</label>
            <input 
              type="password" 
              placeholder="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={inputStyle} 
            />
          </div>
          
          {error !== '' && (
            <div style={{ 
              background: '#FEE2E2', 
              color: '#DC2626', 
              paddingTop: '12px', 
              paddingBottom: '12px', 
              paddingLeft: '14px', 
              paddingRight: '14px', 
              borderRadius: '10px', 
              fontSize: '13px', 
              lineHeight: 1.4 
            }}>
              {error}
            </div>
          )}

          <button onClick={handleSignIn} disabled={loading} style={btnStyle}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#5C7A6B', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#6B7280' }}>New to MSConnect? </span>
          <Link to="/signup" style={{ color: '#5C7A6B', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
            Create an account
          </Link>
        </div>
      </div>

      {/* Background Decoratives */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(92,122,107,0.15)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(196,113,74,0.1)', zIndex: 0 }} />
    </div>
  )
}

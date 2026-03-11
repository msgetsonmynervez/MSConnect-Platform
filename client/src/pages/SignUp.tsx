import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignUp() {
    if (!email || !password || !confirm) { 
      setError('Please fill in all fields.'); 
      return 
    }
    if (password !== confirm) { 
      setError('Passwords do not match.'); 
      return 
    }
    if (password.length < 8) { 
      setError('Password must be at least 8 characters.'); 
      return 
    }
    setLoading(true)
    setError('')
    
    const { error: signUpError } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    })
    
    if (signUpError) { 
      setError(signUpError.message); 
      setLoading(false) 
    } else { 
      setSuccess(true); 
      setLoading(false) 
    }
  }

  // Styles defined with split-padding per iPad Safari safety constraints
  const containerStyle: React.CSSProperties = { 
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
  };

  const cardStyle: React.CSSProperties = { 
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
  };

  const inputStyle: React.CSSProperties = { 
    paddingTop: '14px',
    paddingBottom: '14px',
    paddingLeft: '16px',
    paddingRight: '16px',
    borderRadius: '12px', 
    border: '1.5px solid #E0E0E0',
    background: '#FFFFFF', 
    fontSize: '16px', // Prevents iOS keyboard zoom
    color: '#2C2C2C', 
    outline: 'none' 
  };

  const buttonStyle: React.CSSProperties = { 
    background: '#1C2B3A', 
    color: '#FAF7F2', 
    border: 'none',
    borderRadius: '50px', 
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontSize: '15px', 
    fontWeight: 500,
    cursor: 'pointer', 
    textAlign: 'center', 
    marginTop: '4px' 
  };

  const errorStyle: React.CSSProperties = { 
    background: '#FEE2E2', 
    color: '#DC2626', 
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '14px',
    paddingRight: '14px',
    borderRadius: '10px', 
    fontSize: '13px', 
    lineHeight: 1.4 
  };

  if (success) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#8FAF9F">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 600, color: '#1C2B3A', marginBottom: '8px' }}>
            MS<span style={{ color: '#8FAF9F' }}>Connect</span>
          </div>
          <h2 style={{ fontSize: '22px', color: '#1C2B3A', marginTop: '16px', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
            Check your email
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
            We sent a confirmation link to <strong style={{ color: '#1C2B3A' }}>{email}</strong>.
            Click the link to activate your account then sign in.
          </p>
          <Link to="/signin" style={{ ...buttonStyle, display: 'block', textDecoration: 'none' }}>
            Go to Sign In
          </Link>
        </div>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(92,122,107,0.15)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(196,113,74,0.1)', zIndex: 0 }} />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 600, color: '#1C2B3A', marginBottom: '8px', textAlign: 'center' }}>
          MS<span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '32px', lineHeight: 1.5 }}>
          Join a community that understands
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>Email</label>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="you@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              autoCapitalize="none" 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              placeholder="At least 8 characters"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#1C2B3A' }}>Confirm Password</label>
            <input 
              style={inputStyle} 
              type="password" 
              placeholder="••••••••"
              value={confirm} 
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignUp()} 
            />
          </div>
          
          {error && <div style={errorStyle}>{error}</div>}
          
          <button 
            style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}
            onClick={handleSignUp} 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          
          <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', lineHeight: 1.5 }}>
            Your health data is private and never sold.
          </p>
        </div>
        
        <div style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px' }}>
          <span style={{ color: '#6B7280' }}>Already have an account? </span>
          <Link to="/signin" style={{ color: '#5C7A6B', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
      
      {/* Background Decoratives */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(92,122,107,0.15)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(196,113,74,0.1)', zIndex: 0 }} />
    </div>
  )
}

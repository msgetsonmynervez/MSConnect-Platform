import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Splash Screen Animation State
  const [showSplash, setShowSplash] = useState(false)
  const [fadeSplash, setFadeSplash] = useState(false)

  useEffect(() => {
    // 1. Check if they've already seen the intro this session
    const hasVisited = sessionStorage.getItem('msconnect_welcomed')
    // 2. Check if the user has requested Reduced Motion for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!hasVisited) {
      sessionStorage.setItem('msconnect_welcomed', 'true')
      // Only show the moving video if they haven't disabled motion
      if (!prefersReducedMotion) {
        setShowSplash(true)
      }
    }
  }, [])

  const handleVideoEnd = () => {
    // Trigger the CSS fade out
    setFadeSplash(true)
    // Wait 500ms for the fade out to finish before removing from the DOM entirely
    setTimeout(() => {
      setShowSplash(false)
    }, 500)
  }

  async function handleSignIn(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email || !password) { 
      setError('Please enter your email and password.'); 
      return; 
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) { 
      setError(signInError.message); 
      setLoading(false);
    } else { 
      navigate('/home'); 
    }
  }

  // --- iPad Safe Styles ---
  const containerStyle: React.CSSProperties = { 
    minHeight: '100vh', 
    backgroundColor: '#1C2B3A', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: '24px', 
    paddingBottom: '24px', 
    paddingLeft: '24px', 
    paddingRight: '24px', 
    position: 'relative', 
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  const cardStyle: React.CSSProperties = { 
    backgroundColor: '#FAF7F2', 
    borderRadius: '24px', 
    paddingTop: '40px', 
    paddingBottom: '40px', 
    paddingLeft: '32px', 
    paddingRight: '32px', 
    width: '100%', 
    maxWidth: '400px', 
    position: 'relative', 
    zIndex: 10 
  }

  const inputStyle: React.CSSProperties = { 
    paddingTop: '14px', 
    paddingBottom: '14px', 
    paddingLeft: '16px', 
    paddingRight: '16px', 
    borderRadius: '12px', 
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: '#E0E0E0', 
    backgroundColor: '#FFFFFF', 
    fontSize: '16px', 
    color: '#2C2C2C', 
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  }

  const btnStyle: React.CSSProperties = { 
    backgroundColor: '#1C2B3A', 
    color: '#FAF7F2', 
    border: 'none', 
    borderRadius: '50px', 
    paddingTop: '16px', 
    paddingBottom: '16px', 
    paddingLeft: '24px', 
    paddingRight: '24px', 
    fontSize: '16px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    marginTop: '12px', 
    width: '100%',
    opacity: loading ? 0.7 : 1,
    touchAction: 'manipulation'
  }

  const splashContainerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#FFFFFF', // Matches the video's white background
    zIndex: 99999, // Absolute top layer
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: fadeSplash ? 0 : 1,
    transition: 'opacity 0.5s ease-out',
  }

  // If the splash is active, we render IT instead of the login form
  if (showSplash) {
    return (
      <div style={splashContainerStyle}>
        <video 
          src="/splash.mp4" 
          autoPlay 
          muted 
          playsInline // CRITICAL for iPad/iOS so it doesn't open the native video player
          onEnded={handleVideoEnd}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' // Ensures it fills the screen beautifully
          }} 
        />
      </div>
    )
  }

  // Once the splash is done (or if they've already seen it), show the normal Sign In page
  return (
    <div style={containerStyle} className="fade-in">
      <div style={cardStyle} className="fade-up">

        {/* Top Survey Banner */}
        <div style={{ backgroundColor: '#FDF5F0', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(196,113,74,0.25)', borderRadius: '14px', paddingTop: '14px', paddingBottom: '14px', paddingLeft: '18px', paddingRight: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, margin: 0, flex: 1 }}>
            New here? MSConnect is built for the MS community.
          </p>
          <Link to="/survey" style={{ fontSize: '12px', fontWeight: 'bold', color: '#C4714A', textDecoration: 'none', backgroundColor: 'white', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(196,113,74,0.3)', borderRadius: '8px', paddingTop: '8px', paddingBottom: '8px', paddingLeft: '12px', paddingRight: '12px', flexShrink: 0 }}>
            Take survey
          </Link>
        </div>

        {/* Logo and Tagline */}
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 'bold', color: '#1C2B3A', marginBottom: '8px', textAlign: 'center' }}>
          MS<span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>
        <p style={{ fontSize: '14px', color: '#6B7280', textAlign: 'center', marginBottom: '32px', marginTop: 0 }}>
          Your daily companion for living well
        </p>

        {/* Login Form */}
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1C2B3A' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoCapitalize="none" style={inputStyle} placeholder="you@example.com" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1C2B3A' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
          </div>
          {error !== '' && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '14px', paddingRight: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: '500' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Links Area */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link to="/signup" style={{ color: '#5C7A6B', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>Create an account</Link>
          <span style={{ margin: '0 12px', color: '#E0E0E0' }}>|</span>
          <Link to="/forgot-password" style={{ color: '#5C7A6B', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>Forgot password?</Link>
        </div>

        {/* Legal and Safety Footer */}
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: '#E0E0E0', textAlign: 'center' }}>
          <Link to="/about" style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'underline' }}>Privacy Policy & Medical Disclaimer</Link>
        </div>
      </div>
    </div>
  )
}

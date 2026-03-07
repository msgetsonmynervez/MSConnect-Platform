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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // App.tsx auth listener handles redirect
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-up">

        {/* Logo */}
        <div style={styles.logo}>
          MS<span style={{ color: 'var(--sage-light)' }}>Connect</span>
        </div>
        <p style={styles.tagline}>Your daily companion for living well with MS</p>

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              autoCapitalize="none"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={styles.links}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={{ color: 'var(--text-soft)' }}>New to MSConnect? </span>
          <Link to="/signup" style={styles.link}>Create an account</Link>
        </div>

      </div>

      {/* Background decoration */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'var(--navy)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    background: 'var(--cream)',
    borderRadius: '24px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    fontFamily: 'Fraunces, serif',
    fontSize: '36px',
    fontWeight: 600,
    color: 'var(--navy)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  tagline: {
    fontSize: '14px',
    color: 'var(--text-soft)',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--navy)',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E0E0E0',
    background: 'var(--white)',
    fontSize: '15px',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    background: '#FEE2E2',
    color: '#DC2626',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    lineHeight: 1.4,
  },
  button: {
    background: 'var(--navy)',
    color: 'var(--cream)',
    border: 'none',
    borderRadius: '50px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '4px',
  },
  links: {
    textAlign: 'center',
  },
  link: {
    color: 'var(--sage)',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
  },
  footer: {
    marginTop: '28px',
    textAlign: 'center',
    fontSize: '13px',
  },
  bgCircle1: {
    position: 'absolute',
    top: '-80px',
    right: '-80px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(92,122,107,0.15)',
    zIndex: 0,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '-100px',
    left: '-60px',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(196,113,74,0.1)',
    zIndex: 0,
  },
}
SignUp.tsx
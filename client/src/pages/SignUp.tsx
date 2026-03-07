import { useState } from 'react'
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
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, textAlign: 'center' }} className="fade-up">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <div style={styles.logo}>
            MS<span style={{ color: 'var(--sage-light)' }}>Connect</span>
          </div>
          <h2 style={{ fontSize: '22px', color: 'var(--navy)', margin: '16px 0 8px', fontFamily: 'Fraunces, serif' }}>
            Check your email
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--navy)' }}>{email}</strong>.
            Click the link to activate your account and then sign in.
          </p>
          <Link to="/signin" style={styles.button}>
            Go to Sign In
          </Link>
        </div>
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-up">

        <div style={styles.logo}>
          MS<span style={{ color: 'var(--sage-light)' }}>Connect</span>
        </div>
        <p style={styles.tagline}>Join a community that understands</p>

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoCapitalize="none"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignUp()}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--text-soft)', textAlign: 'center', lineHeight: 1.5 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
            Your health data is private and never sold.
          </p>
        </div>

        <div style={styles.footer}>
          <span style={{ color: 'var(--text-soft)' }}>Already have an account? </span>
          <Link to="/signin" style={styles.link}>Sign in</Link>
        </div>

      </div>
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
    display: 'block',
    background: 'var(--navy)',
    color: 'var(--cream)',
    border: 'none',
    borderRadius: '50px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    marginTop: '4px',
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

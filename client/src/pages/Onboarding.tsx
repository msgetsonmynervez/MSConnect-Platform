import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MS_TYPES = [
  { value: 'rrms',    label: 'RRMS — Relapsing-Remitting MS' },
  { value: 'spms',    label: 'SPMS — Secondary Progressive MS' },
  { value: 'ppms',    label: 'PPMS — Primary Progressive MS' },
  { value: 'cis',     label: 'CIS — Clinically Isolated Syndrome' },
  { value: 'unknown', label: 'Not sure / Prefer not to say' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i)

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [msType, setMsType] = useState('')
  const [diagnosisYear, setDiagnosisYear] = useState('')

  async function handleComplete() {
    if (!displayName || !username || !msType) {
      setError('Please fill in all fields.')
      return
    }
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username must be at least 3 characters and contain only letters, numbers, and underscores.')
      return
    }

    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/signin'); return }

    const { error } = await supabase
      .from('users')
      .update({
        display_name: displayName.trim(),
        username: username.trim().toLowerCase(),
        ms_type: msType,
        diagnosis_year: diagnosisYear ? parseInt(diagnosisYear) : null,
        onboarding_complete: true,
      })
      .eq('auth_id', user.id)

    if (error) {
      if (error.message.includes('unique') || error.code === '23505') {
        setError('That username is already taken. Please choose another.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  const totalSteps = 3

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-up">

        {/* Progress */}
        <div style={styles.progressRow}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} style={{
              ...styles.progressDot,
              background: i + 1 <= step ? 'var(--sage)' : '#E0E0E0',
              transform: i + 1 === step ? 'scale(1.2)' : 'scale(1)',
            }} />
          ))}
        </div>

        {/* Step 1 — Name */}
        {step === 1 && (
          <div className="fade-in">
            <h1 style={styles.heading}>What should we call you?</h1>
            <p style={styles.subheading}>This is the name other members will see.</p>

            <div style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Display Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Jamie or Jamie L."
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={styles.atSign}>@</span>
                  <input
                    style={{ ...styles.input, paddingLeft: '32px' }}
                    type="text"
                    placeholder="your_username"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    maxLength={30}
                    autoCapitalize="none"
                  />
                </div>
                <span style={styles.hint}>Letters, numbers, and underscores only</span>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <button
                style={styles.button}
                onClick={() => {
                  if (!displayName || !username) { setError('Please fill in both fields.'); return }
                  setError('')
                  setStep(2)
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — MS Type */}
        {step === 2 && (
          <div className="fade-in">
            <h1 style={styles.heading}>What type of MS do you have?</h1>
            <p style={styles.subheading}>
              This helps us connect you with the right community groups.
              You can change this anytime.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0' }}>
              {MS_TYPES.map(type => (
                <button
                  key={type.value}
                  style={{
                    ...styles.optionButton,
                    background: msType === type.value ? 'var(--navy)' : 'var(--white)',
                    color: msType === type.value ? 'var(--cream)' : 'var(--text)',
                    border: msType === type.value ? '2px solid var(--navy)' : '2px solid #E0E0E0',
                  }}
                  onClick={() => setMsType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={styles.backButton} onClick={() => { setError(''); setStep(1) }}>
                ← Back
              </button>
              <button
                style={{ ...styles.button, flex: 1 }}
                onClick={() => {
                  if (!msType) { setError('Please select an option.'); return }
                  setError('')
                  setStep(3)
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Diagnosis year */}
        {step === 3 && (
          <div className="fade-in">
            <h1 style={styles.heading}>When were you diagnosed?</h1>
            <p style={styles.subheading}>
              This is optional and only used to match you with peers
              who have a similar experience with MS.
            </p>

            <div style={{ ...styles.form, marginTop: '24px' }}>
              <div style={styles.field}>
                <label style={styles.label}>Year of Diagnosis (optional)</label>
                <select
                  style={styles.input}
                  value={diagnosisYear}
                  onChange={e => setDiagnosisYear(e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={styles.backButton} onClick={() => { setError(''); setStep(2) }}>
                  ← Back
                </button>
                <button
                  style={{ ...styles.button, flex: 1, opacity: loading ? 0.7 : 1 }}
                  onClick={handleComplete}
                  disabled={loading}
                >
                  {loading ? 'Setting up...' : "Let's go 🌿"}
                </button>
              </div>
            </div>
          </div>
        )}

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
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
  },
  progressRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  progressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.3s',
  },
  heading: {
    fontFamily: 'Fraunces, serif',
    fontSize: '26px',
    color: 'var(--navy)',
    marginBottom: '8px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  subheading: {
    fontSize: '14px',
    color: 'var(--text-soft)',
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '24px',
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
    width: '100%',
  },
  hint: {
    fontSize: '11px',
    color: 'var(--text-soft)',
  },
  atSign: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-soft)',
    fontSize: '15px',
    pointerEvents: 'none',
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
    textAlign: 'center',
    textDecoration: 'none',
  },
  backButton: {
    background: 'transparent',
    color: 'var(--text-soft)',
    border: '1.5px solid #E0E0E0',
    borderRadius: '50px',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  optionButton: {
    padding: '14px 18px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
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

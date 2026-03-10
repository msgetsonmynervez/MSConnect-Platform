import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TOTAL = 9

type Answers = {
  q1: string
  q2: string[] | 'skipped'
  q3: string[] | 'skipped'
  q4: string[]
  q5: string[] | 'skipped'
  q6: string
  q7: string
  q8: string
  q9: string | 'skipped'
}

const initialAnswers: Answers = {
  q1: '', q2: [], q3: [], q4: [], q5: [], q6: '', q7: '', q8: '', q9: '',
}

const surveyStyles = `
  .sv-wrap { max-width: 660px; margin: 0 auto; padding: 48px 24px 100px; position: relative; z-index: 1; font-family: inherit; }
  .sv-glow { position: fixed; top: -200px; left: 50%; transform: translateX(-50%); width: 800px; height: 500px; background: radial-gradient(ellipse, rgba(92,122,107,0.1) 0%, transparent 70%); pointer-events: none; z-index: 0; }
  .sv-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--sage-pale); border: 1px solid rgba(92,122,107,0.3); border-radius: 100px; padding: 6px 14px; margin-bottom: 24px; }
  .sv-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); animation: sv-pulse 2s ease infinite; }
  .sv-eyebrow span { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sage); }
  @keyframes sv-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
  .sv-h1 { font-family: Georgia, serif; font-size: clamp(28px, 5.5vw, 42px); font-weight: 300; line-height: 1.15; color: var(--navy); margin-bottom: 18px; }
  .sv-h1 em { font-style: italic; color: var(--sage); }
  .sv-intro { font-size: 15px; color: var(--text-soft); line-height: 1.75; max-width: 500px; margin-bottom: 24px; }
  .sv-meta { display: flex; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
  .sv-meta-pill { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-soft); }
  .sv-prog-wrap { margin-bottom: 32px; }
  .sv-prog-meta { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .sv-prog-label { font-size: 12px; color: var(--text-soft); letter-spacing: 0.06em; }
  .sv-prog-frac { font-size: 13px; color: var(--sage); font-weight: 600; }
  .sv-prog-track { height: 3px; background: #E0E0E0; border-radius: 2px; overflow: hidden; }
  .sv-prog-fill { height: 100%; background: linear-gradient(90deg, var(--sage), var(--sage-light)); border-radius: 2px; transition: width 0.5s cubic-bezier(0.4,0,0.2,1); }
  .sv-card { background: var(--cream); border: 1px solid #E0E0E0; border-radius: 20px; padding: 36px; margin-bottom: 16px; position: relative; overflow: hidden; animation: sv-fadeUp 0.4s ease both; }
  .sv-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(92,122,107,0.2), transparent); }
  @keyframes sv-fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .sv-q-num { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--sage); margin-bottom: 10px; opacity: 0.8; }
  .sv-q-text { font-family: Georgia, serif; font-size: clamp(16px, 3vw, 20px); font-weight: 300; line-height: 1.45; color: var(--navy); margin-bottom: 8px; }
  .sv-q-sub { font-size: 13px; color: var(--text-soft); margin-bottom: 24px; line-height: 1.5; }
  .sv-options { display: flex; flex-direction: column; gap: 9px; }
  .sv-option { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border: 1px solid #E0E0E0; border-radius: 12px; cursor: pointer; transition: all 0.18s ease; background: white; font-size: 14px; color: var(--text-soft); width: 100%; text-align: left; }
  .sv-option:hover { border-color: var(--sage); background: var(--sage-pale); color: var(--navy); }
  .sv-option.sel { border-color: var(--sage); background: var(--sage-pale); color: var(--navy); font-weight: 500; }
  .sv-opt-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #C0C0C0; flex-shrink: 0; transition: all 0.18s; display: flex; align-items: center; justify-content: center; }
  .sv-option.sel .sv-opt-dot { border-color: var(--sage); background: var(--sage); }
  .sv-option.sel .sv-opt-dot::after { content: ''; width: 5px; height: 5px; border-radius: 50%; background: white; }
  .sv-multi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .sv-multi-opt { padding: 13px 14px; border: 1px solid #E0E0E0; border-radius: 12px; cursor: pointer; background: white; font-size: 13px; color: var(--text-soft); text-align: center; line-height: 1.4; transition: all 0.18s ease; }
  .sv-multi-opt:hover { border-color: var(--sage); color: var(--navy); background: var(--sage-pale); }
  .sv-multi-opt.sel { border-color: var(--sage); background: var(--sage-pale); color: var(--sage); font-weight: 500; }
  .sv-rank-item { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border: 1px solid #E0E0E0; border-radius: 12px; background: white; cursor: pointer; transition: all 0.18s ease; font-size: 14px; color: var(--text-soft); width: 100%; text-align: left; }
  .sv-rank-item:hover { border-color: var(--terracotta); background: #FDF5F0; color: var(--navy); }
  .sv-rank-item.sel { border-color: var(--terracotta); background: #FDF5F0; color: var(--terracotta); font-weight: 500; }
  .sv-rank-badge { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #C0C0C0; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--text-soft); transition: all 0.18s; }
  .sv-rank-item.sel .sv-rank-badge { border-color: var(--terracotta); background: var(--terracotta); color: white; }
  .sv-scale-btns { display: flex; gap: 8px; }
  .sv-scale-btn { flex: 1; padding: 14px 4px; border: 1px solid #E0E0E0; border-radius: 10px; background: white; color: var(--text-soft); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s ease; }
  .sv-scale-btn:hover { border-color: var(--sage); color: var(--navy); background: var(--sage-pale); }
  .sv-scale-btn.sel { border-color: var(--sage); background: var(--sage); color: white; }
  .sv-scale-labels { display: flex; justify-content: space-between; margin-top: 10px; font-size: 11px; color: var(--text-soft); }
  .sv-textarea { width: 100%; padding: 16px; border: 1px solid #E0E0E0; border-radius: 12px; background: white; color: var(--navy); font-family: inherit; font-size: 14px; line-height: 1.65; resize: vertical; min-height: 130px; transition: border-color 0.2s; outline: none; box-sizing: border-box; }
  .sv-textarea:focus { border-color: var(--sage); }
  .sv-hint { font-size: 11px; color: var(--text-soft); margin-top: 12px; text-align: center; letter-spacing: 0.04em; }
  .sv-nav { display: flex; gap: 10px; align-items: center; margin-top: 28px; }
  .sv-btn-back { padding: 12px 20px; border: 1px solid #E0E0E0; border-radius: 10px; background: transparent; color: var(--text-soft); font-family: inherit; font-size: 14px; cursor: pointer; transition: all 0.18s; flex-shrink: 0; }
  .sv-btn-back:hover { border-color: var(--sage); color: var(--navy); }
  .sv-btn-back:disabled { opacity: 0.25; cursor: not-allowed; }
  .sv-btn-next { flex: 1; padding: 14px 28px; border: none; border-radius: 10px; background: var(--sage); color: white; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.18s; letter-spacing: 0.01em; }
  .sv-btn-next:hover { background: var(--navy); }
  .sv-btn-next:disabled { opacity: 0.3; cursor: not-allowed; }
  .sv-skip-wrap { text-align: center; margin-top: 12px; }
  .sv-skip-btn { background: none; border: none; color: var(--text-soft); font-family: inherit; font-size: 12px; cursor: pointer; letter-spacing: 0.04em; text-decoration: underline; text-underline-offset: 3px; }
  .sv-skip-btn:hover { color: var(--navy); }
  .sv-error { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #DC2626; margin-bottom: 12px; }
  .sv-ty { text-align: center; padding: 48px 16px; animation: sv-fadeUp 0.6s ease both; }
  .sv-ty-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--sage-pale); border: 1px solid rgba(92,122,107,0.3); border-radius: 100px; padding: 7px 16px; margin-bottom: 28px; }
  .sv-ty-badge span { font-size: 12px; font-weight: 600; color: var(--sage); letter-spacing: 0.08em; text-transform: uppercase; }
  .sv-ty h2 { font-family: Georgia, serif; font-size: 32px; font-weight: 300; margin-bottom: 16px; line-height: 1.2; color: var(--navy); }
  .sv-ty p { font-size: 15px; color: var(--text-soft); line-height: 1.75; max-width: 420px; margin: 0 auto 12px; }
  .sv-ty-note { font-size: 12px; color: var(--text-soft); margin-top: 24px; margin-bottom: 32px; }
  .sv-try-btn { display: inline-block; padding: 14px 32px; background: var(--sage); color: white; border: none; border-radius: 10px; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.18s; }
  .sv-try-btn:hover { background: var(--navy); }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition-duration: 0.01ms !important; } }
  @media (max-width: 480px) { .sv-card { padding: 24px 18px; } .sv-multi-grid { grid-template-columns: 1fr; } .sv-scale-btns { gap: 5px; } .sv-scale-btn { font-size: 13px; padding: 12px 2px; } .sv-meta { gap: 14px; } }
`

export default function DiscoverySurvey() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(1)
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  const progress = ((current - 1) / TOTAL) * 100
  const fracText = current <= TOTAL ? current + ' of ' + TOTAL : 'Complete'

  function pickSingle(q: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [q]: value }))
  }

  function toggleMulti(q: keyof Answers, value: string) {
    const cur = answers[q]
    const arr = Array.isArray(cur) ? cur : []
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
    setAnswers(prev => ({ ...prev, [q]: next }))
  }

  function toggleMax3(value: string) {
    const arr = Array.isArray(answers.q4) ? answers.q4 : []
    if (arr.includes(value)) {
      setAnswers(prev => ({ ...prev, q4: arr.filter(v => v !== value) }))
    } else {
      if (arr.length >= 3) return
      setAnswers(prev => ({ ...prev, q4: [...arr, value] }))
    }
  }

  function skipQuestion(q: keyof Answers) {
    setAnswers(prev => ({ ...prev, [q]: 'skipped' }))
    setCurrent(c => c + 1)
  }

  function canContinue(q: number): boolean {
    if (q === 1) return answers.q1 !== ''
    if (q === 2) { const v = answers.q2; return v === 'skipped' || (Array.isArray(v) && v.length > 0) }
    if (q === 3) { const v = answers.q3; return v === 'skipped' || (Array.isArray(v) && v.length > 0) }
    if (q === 4) return Array.isArray(answers.q4) && answers.q4.length > 0
    if (q === 5) { const v = answers.q5; return v === 'skipped' || (Array.isArray(v) && v.length > 0) }
    if (q === 6) return answers.q6 !== ''
    if (q === 7) return answers.q7 !== ''
    if (q === 8) return answers.q8 !== ''
    return true
  }

  function isSelected(q: keyof Answers, value: string): boolean {
    const v = answers[q]
    if (Array.isArray(v)) return v.includes(value)
    return v === value
  }

  function q4Hint(): string {
    const n = Array.isArray(answers.q4) ? answers.q4.length : 0
    if (n === 0) return 'Choose up to 3'
    if (n === 3) return '3 selected — that\'s your limit'
    return n + ' selected — ' + (3 - n) + ' more allowed'
  }

  async function handleSubmit() {
    setSubmitError('')
    setIsSubmitting(true)

    const q9val = answers.q9
    const finalQ9 = typeof q9val === 'string' && q9val !== 'skipped' && q9val.trim() !== ''
      ? q9val.trim()
      : 'skipped'

    const allAnswers = { ...answers, q9: finalQ9 }

    const skipped: string[] = []
    if (allAnswers.q2 === 'skipped') skipped.push('q2')
    if (allAnswers.q3 === 'skipped') skipped.push('q3')
    if (allAnswers.q5 === 'skipped') skipped.push('q5')
    if (allAnswers.q9 === 'skipped') skipped.push('q9')

    const payload = {
      ms_type: allAnswers.q1 || null,
      daily_symptoms: allAnswers.q2 === 'skipped' ? null : allAnswers.q2 as string[],
      current_tracking_tools: allAnswers.q3 === 'skipped' ? null : allAnswers.q3 as string[],
      priority_features: allAnswers.q4 as string[],
      accessibility_needs: allAnswers.q5 === 'skipped' ? null : allAnswers.q5 as string[],
      bad_day_preference: allAnswers.q6 || null,
      neurologist_frequency: allAnswers.q7 || null,
      data_sharing_comfort: allAnswers.q8 ? parseInt(allAnswers.q8) : null,
      open_feedback: allAnswers.q9 === 'skipped' ? null : allAnswers.q9 as string,
      skipped_questions: skipped,
    }

    const { error } = await supabase
      .from('discovery_survey_responses')
      .insert(payload)

    setIsSubmitting(false)

    if (error) {
      setSubmitError('Something went wrong saving your response. Please try again.')
      return
    }

    setShowThankYou(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const outerStyle: React.CSSProperties = {
    background: 'var(--cream)', minHeight: '100vh', position: 'relative', overflow: 'hidden',
  }

  if (showThankYou) {
    return (
      <div style={outerStyle}>
        <style>{surveyStyles}</style>
        <div className="sv-glow" />
        <div className="sv-wrap">
          <div className="sv-ty">
            <div className="sv-ty-badge"><span>Response received</span></div>
            <h2>You just helped shape MSConnect</h2>
            <p>Your answers go directly to the development team. Every response influences what we build first and how we build it.</p>
            <p>We are designing this for real people living with MS — thank you for being part of that.</p>
            <p className="sv-ty-note">Your responses are anonymous and will never be sold or shared.</p>
            <button className="sv-try-btn" onClick={() => navigate('/signup')}>Try the app</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={outerStyle}>
      <style>{surveyStyles}</style>
      <div className="sv-glow" />
      <div className="sv-wrap">

        <div style={{ marginBottom: '52px', animation: 'sv-fadeUp 0.7s ease both' }}>
          <div className="sv-eyebrow">
            <div className="sv-eyebrow-dot" />
            <span>Early Access — Shape the App</span>
          </div>
          <h1 className="sv-h1">Before we build,<br />we want to <em>hear from you</em></h1>
          <p className="sv-intro">MSConnect is being designed specifically for people living with MS. Your answers will directly influence what we prioritise — features, accessibility, and how the app behaves on difficult days.</p>
          <div className="sv-meta">
            <div className="sv-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              About 4 minutes
            </div>
            <div className="sv-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Completely anonymous
            </div>
            <div className="sv-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Helps real people with MS
            </div>
          </div>
        </div>

        <div className="sv-prog-wrap">
          <div className="sv-prog-meta">
            <span className="sv-prog-label">Progress</span>
            <span className="sv-prog-frac">{fracText}</span>
          </div>
          <div className="sv-prog-track">
            <div className="sv-prog-fill" style={{ width: progress + '%' }} />
          </div>
        </div>

        {current === 1 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 1</div>
            <div className="sv-q-text">Which best describes your MS diagnosis?</div>
            <div className="sv-q-sub">This helps us understand the range of experiences we are designing for.</div>
            <div className="sv-options">
              {['Relapsing-Remitting MS (RRMS)','Secondary Progressive MS (SPMS)','Primary Progressive MS (PPMS)','Clinically Isolated Syndrome / awaiting diagnosis','I\'d prefer not to say'].map(opt => (
                <button key={opt} className={'sv-option' + (isSelected('q1', opt) ? ' sel' : '')} onClick={() => pickSingle('q1', opt)}>
                  <div className="sv-opt-dot" />{opt}
                </button>
              ))}
            </div>
            <div className="sv-nav">
              <button className="sv-btn-back" disabled>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(1)} onClick={() => setCurrent(2)}>Continue</button>
            </div>
          </div>
        )}

        {current === 2 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 2</div>
            <div className="sv-q-text">Which symptoms most affect your daily life?</div>
            <div className="sv-q-sub">Select everything that applies.</div>
            <div className="sv-multi-grid">
              {['Fatigue','Cognitive fog','Mobility / balance','Pain or numbness','Mood / anxiety','Vision changes','Sleep disruption','Heat sensitivity'].map(opt => {
                const arr = Array.isArray(answers.q2) ? answers.q2 : []
                return <button key={opt} className={'sv-multi-opt' + (arr.includes(opt) ? ' sel' : '')} onClick={() => toggleMulti('q2', opt)}>{opt}</button>
              })}
            </div>
            <div className="sv-hint">Tap to select, tap again to deselect</div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(1)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(2)} onClick={() => setCurrent(3)}>Continue</button>
            </div>
            <div className="sv-skip-wrap"><button className="sv-skip-btn" onClick={() => skipQuestion('q2')}>Skip this question</button></div>
          </div>
        )}

        {current === 3 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 3</div>
            <div className="sv-q-text">How do you currently track your symptoms or health?</div>
            <div className="sv-q-sub">Select all that apply.</div>
            <div className="sv-multi-grid">
              {['Paper diary or journal','General health app','MS-specific app','Wearable / smartwatch','I rely on memory','I don\'t track currently'].map(opt => {
                const arr = Array.isArray(answers.q3) ? answers.q3 : []
                return <button key={opt} className={'sv-multi-opt' + (arr.includes(opt) ? ' sel' : '')} onClick={() => toggleMulti('q3', opt)}>{opt}</button>
              })}
            </div>
            <div className="sv-hint">Tap to select, tap again to deselect</div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(2)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(3)} onClick={() => setCurrent(4)}>Continue</button>
            </div>
            <div className="sv-skip-wrap"><button className="sv-skip-btn" onClick={() => skipQuestion('q3')}>Skip this question</button></div>
          </div>
        )}

        {current === 4 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 4</div>
            <div className="sv-q-text">Which features matter most to you in a health app?</div>
            <div className="sv-q-sub">Pick your top 3. We use this directly to set build priority.</div>
            <div className="sv-options">
              {['Daily symptom and energy check-in','Cognitive training exercises','Progress charts over time','Exportable reports for my neurologist','Private journal','Community — connecting with others who have MS','Goal setting and streaks','Medication reminders'].map(opt => {
                const arr = Array.isArray(answers.q4) ? answers.q4 : []
                return (
                  <button key={opt} className={'sv-rank-item' + (arr.includes(opt) ? ' sel' : '')} onClick={() => toggleMax3(opt)}>
                    <div className="sv-rank-badge">{arr.includes(opt) ? arr.indexOf(opt) + 1 : ''}</div>
                    {opt}
                  </button>
                )
              })}
            </div>
            <div className="sv-hint">{q4Hint()}</div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(3)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(4)} onClick={() => setCurrent(5)}>Continue</button>
            </div>
          </div>
        )}

        {current === 5 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 5</div>
            <div className="sv-q-text">Do any of these accessibility needs apply to you?</div>
            <div className="sv-q-sub">These are not edge cases — they are requirements.</div>
            <div className="sv-multi-grid">
              {['Larger text sizes','High contrast mode','Reduced animations','Dark mode','Voice input','Simple / low-clutter screens','None of the above'].map(opt => {
                const arr = Array.isArray(answers.q5) ? answers.q5 : []
                return <button key={opt} className={'sv-multi-opt' + (arr.includes(opt) ? ' sel' : '')} onClick={() => toggleMulti('q5', opt)}>{opt}</button>
              })}
            </div>
            <div className="sv-hint">Tap to select, tap again to deselect</div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(4)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(5)} onClick={() => setCurrent(6)}>Continue</button>
            </div>
            <div className="sv-skip-wrap"><button className="sv-skip-btn" onClick={() => skipQuestion('q5')}>Skip this question</button></div>
          </div>
        )}

        {current === 6 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 6</div>
            <div className="sv-q-text">On a high-symptom day, what would you want the app to do?</div>
            <div className="sv-q-sub">We are building a difficult day mode — your answer tells us what that should look like.</div>
            <div className="sv-options">
              {['Simplify to just one or two essential actions','Detect I\'m struggling and check in on me gently','Give me shorter, easier versions of exercises','Stay out of my way — let me use it normally','Pause my streaks and goals so I don\'t feel guilty'].map(opt => (
                <button key={opt} className={'sv-option' + (isSelected('q6', opt) ? ' sel' : '')} onClick={() => pickSingle('q6', opt)}>
                  <div className="sv-opt-dot" />{opt}
                </button>
              ))}
            </div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(5)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(6)} onClick={() => setCurrent(7)}>Continue</button>
            </div>
          </div>
        )}

        {current === 7 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 7</div>
            <div className="sv-q-text">How often do you see your neurologist or MS nurse?</div>
            <div className="sv-q-sub">This helps us design reporting and appointment features.</div>
            <div className="sv-options">
              {['Every 1–3 months','Every 4–6 months','Once a year','Less than once a year','I don\'t currently have a specialist'].map(opt => (
                <button key={opt} className={'sv-option' + (isSelected('q7', opt) ? ' sel' : '')} onClick={() => pickSingle('q7', opt)}>
                  <div className="sv-opt-dot" />{opt}
                </button>
              ))}
            </div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(6)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(7)} onClick={() => setCurrent(8)}>Continue</button>
            </div>
          </div>
        )}

        {current === 8 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 8</div>
            <div className="sv-q-text">How comfortable are you sharing health data within the app?</div>
            <div className="sv-q-sub">1 = I want full control, nothing shared — 5 = happy to contribute anonymously to MS research</div>
            <div>
              <div className="sv-scale-btns">
                {['1','2','3','4','5'].map(n => (
                  <button key={n} className={'sv-scale-btn' + (answers.q8 === n ? ' sel' : '')} onClick={() => pickSingle('q8', n)}>{n}</button>
                ))}
              </div>
              <div className="sv-scale-labels"><span>Full control only</span><span>Happy to contribute</span></div>
            </div>
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(7)}>Back</button>
              <button className="sv-btn-next" disabled={!canContinue(8)} onClick={() => setCurrent(9)}>Continue</button>
            </div>
          </div>
        )}

        {current === 9 && (
          <div className="sv-card">
            <div className="sv-q-num">Question 9</div>
            <div className="sv-q-text">Is there anything an MS health app has never got right for you?</div>
            <div className="sv-q-sub">No wrong answers — this is the most valuable question in the survey.</div>
            <textarea
              className="sv-textarea"
              placeholder="Type freely here..."
              value={typeof answers.q9 === 'string' && answers.q9 !== 'skipped' ? answers.q9 : ''}
              onChange={e => setAnswers(prev => ({ ...prev, q9: e.target.value }))}
            />
            {submitError !== '' && <div className="sv-error">{submitError}</div>}
            <div className="sv-nav">
              <button className="sv-btn-back" onClick={() => setCurrent(8)}>Back</button>
              <button className="sv-btn-next" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            <div className="sv-skip-wrap">
              <button className="sv-skip-btn" onClick={() => { setAnswers(prev => ({ ...prev, q9: 'skipped' })); handleSubmit() }}>
                Skip and submit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

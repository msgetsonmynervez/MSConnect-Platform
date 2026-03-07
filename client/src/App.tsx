import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'

function App() {
  const [session, setSession] = useState<any>(null)
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) checkOnboarding(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) checkOnboarding(session.user.id)
        else {
          setOnboardingComplete(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function checkOnboarding(authId: string) {
    const { data } = await supabase
      .from('users')
      .select('onboarding_complete')
      .eq('auth_id', authId)
      .single()

    setOnboardingComplete(data?.onboarding_complete ?? false)
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1C2B3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          fontFamily: 'serif',
          fontSize: '32px',
          color: '#FAF7F2',
          fontWeight: 600
        }}>
          MS<span style={{ color: '#8FAF9F' }}>Connect</span>
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #5C7A6B',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={
          !session ? <SignIn /> : <Navigate to={onboardingComplete ? '/home' : '/onboarding'} />
        } />
        <Route path="/signup" element={
          !session ? <SignUp /> : <Navigate to={onboardingComplete ? '/home' : '/onboarding'} />
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={
          session ? <Onboarding /> : <Navigate to="/signin" />
        } />
        <Route path="/home" element={
          session ? <Home /> : <Navigate to="/signin" />
        } />
        <Route path="*" element={
          <Navigate to={session ? (onboardingComplete ? '/home' : '/onboarding') : '/signin'} />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App

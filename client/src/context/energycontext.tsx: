import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, supabase } from '../lib/supabase'

export type UIMode = 'low' | 'standard' | 'full'

interface EnergyContextType {
  // Energy-aware UI
  uiMode: UIMode
  energyLevel: number | null
  overrideMode: (mode: UIMode | null) => void
  // Brain fog
  fogMode: boolean
  toggleFog: () => void
  // Reduced motion
  reducedMotion: boolean
  toggleMotion: () => void
  // Dark mode
  darkMode: boolean
  toggleDark: () => void
  // Font scale
  fontScale: number
  setFontScale: (scale: number) => void
}

const EnergyContext = createContext<EnergyContextType | null>(null)

export function useEnergy() {
  const ctx = useContext(EnergyContext)
  if (!ctx) throw new Error('useEnergy must be used within EnergyProvider')
  return ctx
}

function deriveUIMode(energy: number): UIMode {
  if (energy <= 2) return 'low'
  if (energy === 3) return 'standard'
  return 'full'
}

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [uiMode, setUiMode] = useState<UIMode>('standard')
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [modeOverride, setModeOverride] = useState<UIMode | null>(null)
  const [fogMode, setFogMode] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('msconnect-dark') === 'true'
  })
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem('msconnect-motion')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [fontScale, setFontScaleState] = useState(() => {
    return parseFloat(localStorage.getItem('msconnect-fontscale') ?? '1')
  })

  useEffect(() => {
    async function fetchEnergy() {
      const user = await getCurrentUser()
      if (!user) return
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('daily_checkins')
        .select('energy_level')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle()
      if (data?.energy_level != null) {
        setEnergyLevel(data.energy_level)
        setUiMode(deriveUIMode(data.energy_level))
      }
    }
    fetchEnergy()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('msconnect-dark', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
    localStorage.setItem('msconnect-motion', String(reducedMotion))
  }, [reducedMotion])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale))
    localStorage.setItem('msconnect-fontscale', String(fontScale))
  }, [fontScale])

  function overrideMode(mode: UIMode | null) {
    setModeOverride(mode)
  }

  function toggleFog() {
    setFogMode(f => !f)
  }

  function toggleDark() {
    setDarkMode(d => !d)
  }

  function toggleMotion() {
    setReducedMotion(m => !m)
  }

  function setFontScale(scale: number) {
    setFontScaleState(scale)
  }

  const activeMode = modeOverride ?? uiMode

  return (
    <EnergyContext.Provider value={{
      uiMode: activeMode,
      energyLevel,
      overrideMode,
      fogMode,
      toggleFog,
      reducedMotion,
      toggleMotion,
      darkMode,
      toggleDark,
      fontScale,
      setFontScale,
    }}>
      {children}
    </EnergyContext.Provider>
  )
}

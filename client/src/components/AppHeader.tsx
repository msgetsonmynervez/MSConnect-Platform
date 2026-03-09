import { useEnergy } from '../context/EnergyContext'
import { useEffect, useState } from 'react'

interface AppHeaderProps {
  title: string
  subtitle?: string
}

export default function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { fogMode, toggleFog, darkMode, toggleDark } = useEnergy()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  })

  return (
    <div style={{
      padding: '48px 20px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
    }}>
      <div>
        <div style={{
          fontFamily: 'Georgia, serif', fontSize: '26px',
          fontWeight: 600, color: '#FAF7F2', marginBottom: '4px'
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: '14px', color: '#8FAF9F' }}>{subtitle}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{
          fontSize: '12px', color: '#8FAF9F', fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.03em', minWidth: '70px', textAlign: 'right'
        }}>
          {timeStr}
        </div>
        <button onClick={toggleDark} title="Toggle dark mode" style={{
          background: darkMode ? '#5C7A6B' : 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: '50%', width: '38px', height: '38px',
          fontSize: '16px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleFog} title="Toggle brain fog mode" style={{
          background: fogMode ? '#C4714A' : 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: '50%', width: '38px', height: '38px',
          fontSize: '16px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          🌫️
        </button>
      </div>
    </div>
  )
}

import { useEnergy } from '../context/EnergyContext'

interface FogViewProps {
  title: string
  primaryLabel: string
  onPrimary: () => void
}

export default function FogView({ title, primaryLabel, onPrimary }: FogViewProps) {
  const { toggleFog } = useEnergy()

  return (
    <div style={{
      minHeight: '100vh', background: '#1C2B3A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', flexDirection: 'column'
    }}>
      <button
        onClick={toggleFog}
        title="Exit fog mode"
        style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#C4714A', border: 'none', borderRadius: '50%',
          width: '42px', height: '42px', fontSize: '18px',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200
        }}>
        🌫️
      </button>
      <div style={{
        background: '#FAF7F2', borderRadius: '24px',
        padding: '48px 32px', width: '100%', maxWidth: '360px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌫️</div>
        <h2 style={{
          fontFamily: 'Georgia, serif', fontSize: '24px',
          color: '#1C2B3A', marginBottom: '12px', fontWeight: 600
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '32px'
        }}>
          Fog mode is on. One thing at a time.
        </p>
        <button onClick={onPrimary} style={{
          background: '#5C7A6B', color: '#FAF7F2', border: 'none',
          borderRadius: '50px', padding: '18px', fontSize: '16px',
          fontWeight: 500, cursor: 'pointer', width: '100%',
          marginBottom: '16px'
        }}>
          {primaryLabel}
        </button>
        <button onClick={toggleFog} style={{
          background: 'transparent', color: '#8FAF9F', border: 'none',
          fontSize: '13px', cursor: 'pointer', padding: '8px'
        }}>
          Exit fog mode
        </button>
      </div>
    </div>
  )
}

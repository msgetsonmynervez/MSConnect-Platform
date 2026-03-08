interface FogViewProps {
  title: string
  primaryLabel: string
  onPrimary: () => void
}

export default function FogView({ title, primaryLabel, onPrimary }: FogViewProps) {
  return (
    <div style={{
      minHeight: '100vh', background: '#1C2B3A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
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
          fontWeight: 500, cursor: 'pointer', width: '100%'
        }}>
          {primaryLabel}
        </button>
      </div>
    </div>
  )
}

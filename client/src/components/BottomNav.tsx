import { useLocation, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/home', emoji: '🏠', label: 'Home' },
  { path: '/checkin', emoji: '✓', label: 'Check-in' },
  { path: '/train', emoji: '🧠', label: 'Train' },
  { path: '/community', emoji: '💬', label: 'Community' },
  { path: '/progress', emoji: '📈', label: 'Progress' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#FAF7F2', borderTop: '1px solid #E0E0E0',
      display: 'flex', justifyContent: 'space-around',
      padding: '8px 0 20px 0', zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
    }}>
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path
        return (
          <button key={item.path} onClick={() => navigate(item.path)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '4px', background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 12px', borderRadius: '12px',
            transition: 'all 0.2s'
          }}>
            <span style={{
              fontSize: item.emoji === '✓' ? '20px' : '22px',
              lineHeight: 1,
              opacity: active ? 1 : 0.5,
              fontWeight: item.emoji === '✓' ? 700 : 400,
              color: active ? '#5C7A6B' : '#1C2B3A'
            }}>{item.emoji}</span>
            <span style={{
              fontSize: '10px', fontWeight: active ? 600 : 400,
              color: active ? '#5C7A6B' : '#6B7280',
              letterSpacing: '0.02em'
            }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

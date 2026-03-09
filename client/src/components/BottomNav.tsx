import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const TABS = [
  { path: '/home', label: 'Home', emoji: '🏠' },
  { path: '/checkin', label: 'Check-in', emoji: '✅' },
  { path: '/train', label: 'Train', emoji: '🧠' },
  { path: '/community', label: 'Community', emoji: '💬' },
  { path: '/progress', label: 'Progress', emoji: '📊' },
]

const MORE_ITEMS = [
  { path: '/journal', label: 'Journal', emoji: '📖' },
  { path: '/goals', label: 'Goals', emoji: '🎯' },
  { path: '/restroom', label: 'Restroom', emoji: '🚻' },
  { path: '/news', label: 'MS News', emoji: '📰' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = MORE_ITEMS.some(m => m.path === location.pathname)

  return (
    <>
      {showMore && (
        <div
          onClick={() => setShowMore(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)', zIndex: 150,
          }}
        />
      )}

      {showMore && (
        <div style={{
          position: 'fixed', bottom: '70px', right: '16px',
          background: '#FAF7F2', borderRadius: '20px',
          padding: '8px', zIndex: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          minWidth: '160px',
        }}>
          {MORE_ITEMS.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setShowMore(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  width: '100%', padding: '12px 16px', border: 'none',
                  background: active ? '#EDF3F0' : 'transparent',
                  borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                <span style={{
                  fontSize: '14px', fontWeight: active ? 600 : 400,
                  color: active ? '#5C7A6B' : '#1C2B3A',
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#FAF7F2', borderTop: '1px solid #F0EDE8',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 0 12px', zIndex: 100,
      }}>
        {TABS.map(tab => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '3px', padding: '4px 10px', flex: 1,
              }}
            >
              <span style={{
                fontSize: '22px',
                opacity: active ? 1 : 0.5,
                transform: active ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s',
              }}>
                {tab.emoji}
              </span>
              <span style={{
                fontSize: '10px',
                color: active ? '#5C7A6B' : '#6B7280',
                fontWeight: active ? 600 : 400,
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
        <button
          onClick={() => setShowMore(v => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '3px', padding: '4px 10px', flex: 1,
          }}
        >
          <span style={{
            fontSize: '22px',
            opacity: isMoreActive || showMore ? 1 : 0.5,
            transform: isMoreActive || showMore ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s',
          }}>
            ⋯
          </span>
          <span style={{
            fontSize: '10px',
            color: isMoreActive || showMore ? '#5C7A6B' : '#6B7280',
            fontWeight: isMoreActive || showMore ? 600 : 400,
          }}>
            More
          </span>
        </button>
      </div>
    </>
  )
}

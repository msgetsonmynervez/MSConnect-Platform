import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

const TABS = [
  { path: '/home', label: 'Home', icon: 'H' },
  { path: '/checkin', label: 'Check-in', icon: 'C' },
  { path: '/train', label: 'Train', icon: 'T' },
  { path: '/community', label: 'Community', icon: 'M' },
  { path: '/progress', label: 'Progress', icon: 'P' },
]

const MORE_ITEMS = [
  { path: '/journal', label: 'Journal' },
  { path: '/goals', label: 'Goals' },
  { path: '/restroom', label: 'Restroom' },
  { path: '/news', label: 'MS News' },
  { path: '/survey', label: 'Take the Survey' },
  { path: '/about', label: 'About MSConnect' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showMore, setShowMore] = useState(false)

  const isMoreActive = MORE_ITEMS.some(m => m.path === location.pathname)

  const overlayStyle: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }
  const menuStyle: React.CSSProperties = { position: 'fixed', bottom: '70px', right: '16px', background: '#FAF7F2', borderRadius: '20px', padding: '8px', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: '180px' }
  const navBarStyle: React.CSSProperties = { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FAF7F2', borderTop: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingTop: '8px', paddingBottom: '12px', zIndex: 100 }

  return (
    <>
      {showMore && <div onClick={() => setShowMore(false)} style={overlayStyle} />}

      {showMore && (
        <div style={menuStyle}>
          {MORE_ITEMS.map(item => {
            const active = location.pathname === item.path
            const isSurvey = item.path === '/survey'
            const itemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px', border: 'none', background: active ? '#EDF3F0' : isSurvey ? '#FDF5F0' : 'transparent', borderRadius: '12px', cursor: 'pointer', textAlign: 'left' }
            const labelStyle: React.CSSProperties = { fontSize: '14px', fontWeight: active || isSurvey ? 600 : 400, color: active ? '#5C7A6B' : isSurvey ? '#C4714A' : '#1C2B3A' }
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setShowMore(false) }} style={itemStyle}>
                <span style={labelStyle}>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}

      <div style={navBarStyle}>
        {TABS.map(tab => {
          const active = location.pathname === tab.path
          const dotStyle: React.CSSProperties = { width: '28px', height: '28px', borderRadius: '8px', background: active ? '#EDF3F0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', paddingTop: '4px', paddingBottom: '4px', paddingLeft: '10px', paddingRight: '10px', flex: 1 }}>
              <div style={dotStyle}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: active ? '#5C7A6B' : '#6B7280' }}>{tab.icon}</span>
              </div>
              <span style={{ fontSize: '10px', color: active ? '#5C7A6B' : '#6B7280', fontWeight: active ? 600 : 400 }}>{tab.label}</span>
            </button>
          )
        })}
        <button onClick={() => setShowMore(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', paddingTop: '4px', paddingBottom: '4px', paddingLeft: '10px', paddingRight: '10px', flex: 1 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isMoreActive || showMore ? '#EDF3F0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '16px', color: isMoreActive || showMore ? '#5C7A6B' : '#6B7280', lineHeight: 1 }}>...</span>
          </div>
          <span style={{ fontSize: '10px', color: isMoreActive || showMore ? '#5C7A6B' : '#6B7280', fontWeight: isMoreActive || showMore ? 600 : 400 }}>More</span>
        </button>
      </div>
    </>
  )
}

import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import AppHeader from '../components/AppHeader'

interface Place {
  name: string
  vicinity: string
  distance: string
  mapsUrl: string
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * Math.PI / 180)
    * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatDist(km: number): string {
  if (km < 1) {
    const m = Math.round(km * 1000)
    return m + 'm away'
  }
  return km.toFixed(1) + 'km away'
}

export default function RestroomFinder() {
  const [status, setStatus] = useState<'idle' | 'locating' | 'searching' | 'done' | 'error'>('idle')
  const [places, setPlaces] = useState<Place[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  async function findRestrooms() {
    setStatus('locating')
    setPlaces([])
    setErrorMsg('')

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported on this device.')
      setStatus('error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setStatus('searching')

        try {
          const query = encodeURIComponent('public restroom toilet')
          const viewbox = (lng - 0.02) + ',' + (lat + 0.02) + ',' + (lng + 0.02) + ',' + (lat - 0.02)
          const url = 'https://nominatim.openstreetmap.org/search'
            + '?q=' + query
            + '&format=json'
            + '&limit=8'
            + '&viewbox=' + viewbox
            + '&bounded=1'

          const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
          const data = await res.json()

          if (data && data.length > 0) {
            const results: Place[] = data.slice(0, 6).map((p: any) => {
              const plat = parseFloat(p.lat)
              const plng = parseFloat(p.lon)
              const dist = haversine(lat, lng, plat, plng)
              const mapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + plat + ',' + plng
              const nameParts = p.display_name.split(',')
              return {
                name: nameParts[0],
                vicinity: nameParts.slice(1, 3).join(',').trim(),
                distance: formatDist(dist),
                mapsUrl,
              }
            })
            setPlaces(results)
            setStatus('done')
          } else {
            const fallback = 'https://www.google.com/maps/search/public+restroom/@' + lat + ',' + lng + ',15z'
            setPlaces([{
              name: 'Search on Google Maps',
              vicinity: 'Tap to open restroom search near your location',
              distance: '',
              mapsUrl: fallback,
            }])
            setStatus('done')
          }
        } catch {
          const fallback = 'https://www.google.com/maps/search/public+restroom/@' + lat + ',' + lng + ',15z'
          setPlaces([{
            name: 'Open Google Maps',
            vicinity: 'Tap to search for restrooms near your location',
            distance: '',
            mapsUrl: fallback,
          }])
          setStatus('done')
        }
      },
      () => {
        setErrorMsg('Could not get your location. Please enable location access and try again.')
        setStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const searching = status === 'locating' || status === 'searching'

  return (
    <div style={{ minHeight: '100vh', background: '#1C2B3A', paddingBottom: '80px' }}>
      <AppHeader title="Restroom Finder" subtitle="Find accessible restrooms nearby" />

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <div style={{
          background: '#FAF7F2', borderRadius: '20px',
          padding: '28px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🚻</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#1C2B3A', marginBottom: '8px' }}>
            {status === 'idle' && 'Find the nearest restroom'}
            {status === 'locating' && 'Getting your location...'}
            {status === 'searching' && 'Searching nearby...'}
            {status === 'done' && 'Restrooms found'}
            {status === 'error' && 'Location unavailable'}
          </div>
          {status === 'idle' && (
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px', lineHeight: 1.6 }}>
              One tap to find the nearest accessible restroom. Uses your current location.
            </div>
          )}
          {status === 'error' && (
            <div style={{ fontSize: '13px', color: '#DC2626', marginBottom: '20px' }}>
              {errorMsg}
            </div>
          )}
          <button
            onClick={findRestrooms}
            disabled={searching}
            style={{
              background: searching ? '#2E4057' : '#1C2B3A',
              color: '#FAF7F2',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 32px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: searching ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'all 0.2s',
            }}
          >
            {status === 'idle' && 'Find Restrooms Now'}
            {status === 'locating' && 'Locating...'}
            {status === 'searching' && 'Searching...'}
            {status === 'done' && 'Search Again'}
            {status === 'error' && 'Try Again'}
          </button>
        </div>

        {places.map((place, i) => (
          <a
            key={i}
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: i === 0 ? '#EDF3F0' : '#FAF7F2',
              borderRadius: '20px',
              padding: '18px 20px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: i === 0 ? '1.5px solid #5C7A6B' : 'none',
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: i === 0 ? '#5C7A6B' : '#F0EDE8',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', flexShrink: 0,
            }}>
              {i === 0 ? '📍' : '🚻'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1C2B3A', marginBottom: '2px' }}>
                {place.name}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>
                {place.vicinity}
              </div>
            </div>
            {place.distance !== '' && (
              <div style={{
                fontSize: '12px', fontWeight: 600,
                color: i === 0 ? '#5C7A6B' : '#6B7280',
                flexShrink: 0,
              }}>
                {place.distance}
              </div>
            )}
          </a>
        ))}

      </div>
      <BottomNav />
    </div>
  )
}

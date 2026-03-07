import { useEffect, useState } from 'react'
import { getCurrentUser, supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser()
        if (!data) {
          setDebugInfo('No user data returned from getCurrentUser')
        }
        setUser(data)
        setLoading(false)
      } catch (e: any) {
        setDebugInfo(`Exception: ${e.message}`)
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  return (
    <div style={{minHeight:'100vh',background:'#1C2B3A',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'#FAF7F2',borderRadius:'24px',padding:'40px 32px',width:'100%',maxWidth:'400px',textAlign:'center'}}>

        <div style={{fontFamily:'Georgia, serif',fontSize:'36px',fontWeight:600,color:'#1C2B3A',marginBottom:'8px'}}>
          MS<span style={{color:'#5C7A6B'}}>Connect</span>
        </div>

        {loading && (
          <p style={{color:'#6B7280',fontSize:'14px',margin:'20px 0'}}>Loading...</p>
        )}

        {!loading && user && (
          <>
            <p style={{fontSize:'20px',margin:'20px 0 4px',color:'#1C2B3A',fontWeight:500}}>
              Welcome, {user.display_name} 🌿
            </p>
            <p style={{fontSize:'13px',color:'#6B7280',marginBottom:'24px'}}>
              @{user.username} · {user.ms_type?.toUpperCase()}
            </p>
          </>
        )}

        {!loading && !user && (
          <div style={{background:'#FEE2E2',borderRadius:'12px',padding:'16px',margin:'20px 0',textAlign:'left'}}>
            <p style={{color:'#DC2626',fontSize:'13px',fontWeight:500,marginBottom:'8px'}}>Debug:</p>
            <p style={{color:'#DC2626',fontSize:'11px',wordBreak:'break-all',lineHeight:1.6}}>{debugInfo}</p>
          </div>
        )}

        <div style={{background:'#EDF3F0',borderRadius:'16px',padding:'20px',marginBottom:'24px'}}>
          <p style={{fontSize:'14px',color:'#5C7A6B',fontWeight:500}}>🎉 Auth flow complete!</p>
          <p style={{fontSize:'13px',color:'#6B7280',marginTop:'8px',lineHeight:1.5}}>
            Training, community, and progress screens coming next.
          </p>
        </div>

        <button
          onClick={() => supabase.auth.signOut()}
          style={{background:'transparent',color:'#6B7280',border:'1.5px solid #E0E0E0',borderRadius:'50px',padding:'12px 24px',fontSize:'14px',cursor:'pointer'}}>
          Sign Out
        </button>

      </div>
    </div>
  )
}

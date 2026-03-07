export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'#1C2B3A',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#FAF7F2',borderRadius:'24px',padding:'40px 32px',maxWidth:'400px',width:'100%',textAlign:'center'}}>
        <div style={{fontFamily:'Georgia, serif',fontSize:'36px',fontWeight:600,color:'#1C2B3A',marginBottom:'16px'}}>
          MS<span style={{color:'#5C7A6B'}}>Connect</span>
        </div>
        <h1 style={{fontSize:'22px',color:'#1C2B3A',marginBottom:'12px'}}>Page not found</h1>
        <a href="/signin" style={{color:'#5C7A6B',fontSize:'14px'}}>Go to Sign In</a>
      </div>
    </div>
  )
}

import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {

  const pageStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    paddingTop: '40px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    overflowX: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const homeButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '50px',
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '28px',
    paddingRight: '28px',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative',
    zIndex: 9999
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
    marginBottom: '20px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#E0E0E0',
    lineHeight: '1.6',
    color: '#1C2B3A',
    position: 'relative',
    zIndex: 10
  };

  return (
    <div style={pageStyle}>
      
      {/* THE NEW HOME BUTTON */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/home" style={homeButtonStyle}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ marginRight: '8px' }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </Link>
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#1C2B3A', marginBottom: '24px', marginTop: '0px' }}>
          Privacy & Safety
        </h1>

        <section style={cardStyle}>
          <h2 style={{ color: '#DC2626', fontSize: '20px', marginTop: '0px', marginBottom: '12px' }}>Medical Disclaimer</h2>
          <p style={{ margin: '0px' }}>
            MSConnect is a tracking tool, not a medical provider. We do not provide medical advice or diagnosis. Always consult your physician.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ color: '#5C7A6B', fontSize: '20px', marginTop: '0px', marginBottom: '12px' }}>Your Data</h2>
          <p style={{ margin: '0px' }}>
            We use Zero-Knowledge architecture. Your survey responses are encrypted and processed locally on your device.
          </p>
        </section>
      </div>

      {/* Background Decoratives - Ghosted out so they never block touches */}
      <div style={{ 
        position: 'absolute', top: '-50px', right: '-50px', 
        width: '300px', height: '300px', borderRadius: '50%', 
        backgroundColor: 'rgba(92,122,107,0.08)', zIndex: 1,
        pointerEvents: 'none' 
      }} />
      
      <div style={{ 
        position: 'absolute', bottom: '0px', left: '-50px', 
        width: '250px', height: '250px', borderRadius: '50%', 
        backgroundColor: 'rgba(196,113,74,0.05)', zIndex: 1,
        pointerEvents: 'none' 
      }} />

    </div>
  );
};

export default About;

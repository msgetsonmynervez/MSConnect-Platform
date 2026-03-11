import React from 'react';

const About: React.FC = () => {

  // Bypass React Router and force a hard navigation at the browser level
  const forceNavigate = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = '/signin';
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    paddingTop: '80px', // Pushed down to make room for the fixed button
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const nuclearButtonStyle: React.CSSProperties = {
    position: 'fixed', // Escapes all container limitations
    top: '20px',
    left: '20px',
    zIndex: 999999, // Absolute highest layer possible
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    borderStyle: 'none',
    borderRadius: '50px',
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '24px',
    paddingRight: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'none' // Forces the browser to hand touch control to JavaScript immediately
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
    color: '#1C2B3A'
  };

  return (
    <div style={pageStyle}>
      
      {/* THE NUCLEAR BUTTON
        Using onTouchStart ensures the second your finger touches the glass, it fires.
      */}
      <button 
        style={nuclearButtonStyle}
        onClick={forceNavigate}
        onTouchStart={forceNavigate}
      >
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
      </button>

      {/* Main Content Area */}
      <div>
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

    </div>
  );
};

export default About;

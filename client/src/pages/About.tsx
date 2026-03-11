import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If we're in a PWA/Standalone mode, history.length is often 1.
    // This ensures the button ALWAYS works.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/signin');
    }
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      paddingTop: '40px',
      paddingBottom: '80px',
      paddingLeft: '24px',
      paddingRight: '24px',
      overflowX: 'hidden'
    }}>
      
      {/* THE FIX: A dedicated, high-z-index top bar for the button */}
      <div style={{
        position: 'relative',
        zIndex: 100, // Higher than any decorative circles
        marginBottom: '32px'
      }}>
        <button 
          onClick={handleBack}
          style={{
            backgroundColor: '#1C2B3A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '32px',
            paddingRight: '32px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            // iPad Safari Touch Fixes
            WebkitAppearance: 'none',
            touchAction: 'manipulation'
          }}
        >
          ← Back
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', marginBottom: '24px' }}>
          Privacy & Safety
        </h1>

        <section style={cardStyle}>
          <h2 style={{ color: '#DC2626', fontSize: '20px', marginTop: '0' }}>Medical Disclaimer</h2>
          <p>MSConnect is a tracking tool, not a medical provider. We do not provide medical advice or diagnosis.</p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ color: '#5C7A6B', fontSize: '20px', marginTop: '0' }}>Your Data</h2>
          <p>We use Zero-Knowledge architecture. Your survey responses are encrypted and processed locally on this iPad.</p>
        </section>
      </div>

      {/* THE FIX FOR SCENARIO A: 
          Adding 'pointerEvents: none' to these background circles.
          This makes them "ghosts" so clicks pass right through them. */}
      <div style={{ 
        position: 'absolute', top: '-50px', right: '-50px', 
        width: '300px', height: '300px', borderRadius: '50%', 
        background: 'rgba(92,122,107,0.08)', zIndex: 1,
        pointerEvents: 'none' 
      }} />
      
      <div style={{ 
        position: 'absolute', bottom: '0', left: '-50px', 
        width: '250px', height: '250px', borderRadius: '50%', 
        background: 'rgba(196,113,74,0.05)', zIndex: 1,
        pointerEvents: 'none' 
      }} />

    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  paddingTop: '24px',
  paddingBottom: '24px',
  paddingLeft: '24px',
  paddingRight: '24px',
  marginBottom: '20px',
  border: '1px solid #E0E0E0',
  lineHeight: '1.6'
};

export default About;

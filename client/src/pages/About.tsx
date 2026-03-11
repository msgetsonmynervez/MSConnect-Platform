import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
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
      
      {/* THE FIX: Replaced <button> with <Link>. 
          Safari natively prioritizes touch events on anchor tags over buttons. */}
      <div style={{ position: 'relative', zIndex: 9999, marginBottom: '32px' }}>
        <Link 
          to="/signin" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#1C2B3A',
            color: '#FFFFFF',
            textDecoration: 'none', // Prevents the default link underline
            borderRadius: '50px',
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '32px',
            paddingRight: '32px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <span style={{ marginRight: '8px' }}>←</span> Back
        </Link>
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#1C2B3A', marginBottom: '24px', marginTop: '0' }}>
          Privacy & Safety
        </h1>

        <section style={cardStyle}>
          <h2 style={{ color: '#DC2626', fontSize: '20px', marginTop: '0', marginBottom: '12px' }}>Medical Disclaimer</h2>
          <p style={{ margin: '0' }}>
            MSConnect is a tracking tool, not a medical provider. We do not provide medical advice or diagnosis. Always consult your physician.
          </p>
        </section>

        <section style={cardStyle}>
          <h2 style={{ color: '#5C7A6B', fontSize: '20px', marginTop: '0', marginBottom: '12px' }}>Your Data</h2>
          <p style={{ margin: '0' }}>
            We use Zero-Knowledge architecture. Your survey responses are encrypted and processed locally on your device.
          </p>
        </section>
      </div>

      {/* Background Decoratives - Ghosted out */}
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
  lineHeight: '1.6',
  color: '#1C2B3A'
};

export default About;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Client-side routing: No server reload required.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/signin');
    }
  };

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    paddingTop: '40px',
    paddingBottom: '80px',
    paddingLeft: '24px',
    paddingRight: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '28px',
    paddingRight: '28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginBottom: '32px'
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

  return (
    <div style={pageStyle}>
      
      {/* The beautifully restored React Router button */}
      <button onClick={handleBack} style={buttonStyle}>
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
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

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

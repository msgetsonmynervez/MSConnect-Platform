import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  // Unified Navigation Handler
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents touch events from bubbling to layers below
    
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const pageStyle: React.CSSProperties = {
    paddingTop: '30px',
    paddingBottom: '100px',
    paddingLeft: '20px',
    paddingRight: '20px',
    color: '#1C2B3A',
    backgroundColor: '#FAF7F2',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: '1.6',
    position: 'relative',
    overflowX: 'hidden'
  };

  const backButtonStyle: React.CSSProperties = {
    // Positioning
    position: 'relative',
    zIndex: 9999, // Absolute top layer
    
    // Appearance
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    
    // Touch Target (Standard for iPad Accessibility)
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '28px',
    paddingRight: '28px',
    
    // Text
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '30px',
    
    // Layout
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    
    // Safari Fixes
    WebkitAppearance: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    touchAction: 'manipulation' // Optimizes for touch
  };

  const sectionBox: React.CSSProperties = {
    position: 'relative',
    zIndex: 2, // Above background circles
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '24px',
    marginBottom: '20px',
    border: '1px solid #E0E0E0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };

  return (
    <div style={pageStyle}>
      {/* 1. Back Button - Placed at the top level for unobstructed access */}
      <button style={backButtonStyle} onClick={handleBack}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      <h1 style={{ fontSize: '32px', marginBottom: '24px', fontFamily: 'Georgia, serif', position: 'relative', zIndex: 2 }}>
        Privacy & Safety
      </h1>
      
      <div style={sectionBox}>
        <h2 style={{ color: '#DC2626', marginTop: '0px', fontSize: '20px' }}>Medical Disclaimer</h2>
        <p><strong>MSConnect is a tracking tool, not a medical provider.</strong></p>
        <p>
          We do not provide medical advice, diagnosis, or treatment. This platform is part of a 
          creative multiverse designed for peer support and personal wellness tracking.
        </p>
        <p>
          Always seek the advice of your physician. If you are in crisis, tap the 
          <strong> Safety</strong> tab immediately.
        </p>
      </div>

      <div style={sectionBox}>
        <h2 style={{ marginTop: '0px', fontSize: '20px', color: '#5C7A6B' }}>Privacy by Design</h2>
        <p>We use a <strong>Zero-Knowledge</strong> approach to protect your data:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>Survey Blindness:</strong> Individual survey responses are write-only. They cannot be retrieved via the app once submitted.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>Local Processing:</strong> All data narrations and summaries are generated on your iPad. No health data is sent to external AI servers.
          </li>
          <li>
            <strong>Anonymity:</strong> We identify you by a secure ID, never by your legal name or physical address.
          </li>
        </ul>
      </div>

      {/* Decorative Background Circles - Z-Index 1 to keep them behind content */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(92,122,107,0.05)', zIndex: 1 }} />
      <div style={{ position: 'absolute', bottom: '100px', left: '-50px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(196,113,74,0.05)', zIndex: 1 }} />

      <footer style={{ textAlign: 'center', marginTop: '40px', position: 'relative', zIndex: 2 }}>
        <p style={{ fontSize: '12px', color: '#6B7280' }}>
          MSConnect Social Enterprise © 2026
        </p>
      </footer>
    </div>
  );
};

export default About;

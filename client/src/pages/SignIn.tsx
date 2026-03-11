import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const pageStyle: React.CSSProperties = {
    paddingTop: '20px',
    paddingBottom: '100px',
    paddingLeft: '16px',
    paddingRight: '16px',
    color: '#1C2B3A',
    backgroundColor: '#FAF7F2',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: '1.6'
  };

  const boxStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginBottom: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#E0E0E0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '24px',
    paddingRight: '24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px'
  };

  return (
    <div style={pageStyle}>
      <button style={buttonStyle} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 style={{ fontSize: '28px', marginBottom: '24px', fontFamily: 'Georgia, serif' }}>
        Privacy & Safety
      </h1>
      
      <div style={boxStyle}>
        <h2 style={{ color: '#DC2626', marginTop: '0px', fontSize: '18px' }}>Medical Disclaimer</h2>
        <p style={{ fontWeight: 'bold' }}>MSConnect is a tracking tool, not a medical provider.</p>
        <p>
          We do not give medical advice, diagnosis, or treatment. This app is part of a creative multiverse 
          designed for peer support and personal insight.
        </p>
        <p>
          If you are in a crisis or need medical help, please use the <strong>Safety</strong> tab 
          immediately or contact emergency services.
        </p>
      </div>

      <div style={boxStyle}>
        <h2 style={{ marginTop: '0px', fontSize: '18px', color: '#5C7A6B' }}>Your Data Privacy</h2>
        <p>We use a <strong>Zero-Knowledge</strong> approach to keep you safe:</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '12px' }}>
            <strong>Survey Blindness:</strong> Once you submit a survey, it is encrypted. Even our team cannot link answers back to your specific account.
          </li>
          <li style={{ marginBottom: '12px' }}>
            <strong>No Real Names:</strong> Your account uses a unique ID. We never ask for or store your legal name.
          </li>
          <li>
            <strong>Local Audio:</strong> The Data Narrator processes speech on your device. Your health data is never sent to an AI cloud for voice synthesis.
          </li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontSize: '12px', color: '#6B7280' }}>
          MSConnect Social Enterprise © 2026
        </p>
      </div>
    </div>
  );
};

export default About;

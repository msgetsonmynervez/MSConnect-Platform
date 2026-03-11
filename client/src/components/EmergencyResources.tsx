import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyResources: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#FFF5F5',
    borderRadius: '12px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#E53E3E',
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '16px',
    paddingRight: '16px',
    marginTop: '20px',
    marginBottom: '40px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#C53030',
    marginBottom: '16px',
    marginTop: '0px',
    display: 'flex',
    alignItems: 'center'
  };

  const itemStyle: React.CSSProperties = {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#FED7D7'
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '4px',
    color: '#2B6CB0',
    fontWeight: 'bold',
    textDecoration: 'underline',
    fontSize: '18px' // Larger for easier tapping on iPad
  };

  const backButtonStyle: React.CSSProperties = {
    backgroundColor: '#1C2B3A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginBottom: '20px',
    fontWeight: '600',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
      <button style={backButtonStyle} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={containerStyle}>
        <h2 style={headerStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '10px' }}>
            <path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
          </svg>
          Emergency Resources
        </h2>

        <div style={itemStyle}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4A5568' }}>Crisis & Suicide Lifeline (USA)</span>
          <br />
          <a href="tel:988" style={linkStyle}>Call or Text: 988</a>
        </div>

        <div style={itemStyle}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4A5568' }}>National MS Society</span>
          <br />
          <a href="tel:18003444867" style={linkStyle}>1-800-344-4867</a>
        </div>

        <div style={{ ...itemStyle, borderBottom: 'none' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4A5568' }}>Crisis Text Line</span>
          <br />
          <a href="sms:741741" style={linkStyle}>Text HOME to 741741</a>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#718096', textAlign: 'center', lineHeight: '1.5' }}>
        If you are experiencing a medical emergency, please dial 911 or your local emergency services immediately.
      </p>
    </div>
  );
};

export default EmergencyResources;

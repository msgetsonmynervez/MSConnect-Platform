// /src/pages/Home.tsx (FULL FIXED CODE with Navigation)
import React, { useState } from 'react';
// 1. Import useNavigate for seamless iPad navigation
import { useNavigate } from 'react-router-dom'; 
import { useNarrator } from '../hooks/useNarrator'; 
import { seedSymptomDatabase } from '../utils/seedIndexedDB'; 

// ... (Rest of a11yStyles, FeatureCard, and FeatureCardProps are unchanged)

/**
 * Access Modal Styles (Peaceful A11y Design)
 */
const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(17, 24, 39, 0.75)', // Dark Slate Gray, soft overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '24px',
    maxWidth: '600px',
    width: '90%',
    textAlign: 'center' as const,
    boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
  },
  title: {
    color: '#3C5A51', // Sage Green
    fontSize: '2.5rem',
    fontWeight: '900',
    margin: '0 0 1rem 0', // Top, Right, Bottom, Left (JS string notation)
  },
  text: {
    color: '#374151', // Higher contrast
    fontSize: '1.4rem',
    lineHeight: '1.8',
    margin: '0 0 2rem 0', // Top, Right, Bottom, Left (JS string notation)
    fontStyle: 'italic',
  },
  // HUGE, calming close button for tremors
  closeButton: {
    backgroundColor: '#3C5A51',
    color: 'white',
    padding: '1.5rem 3rem',
    fontSize: '1.4rem',
    fontWeight: '700',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '300px',
  },
};

/**
 * Home Component (Landing Page)
 */
const Home: React.FC = () => {
  // 2. State for the Access Modal
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  
  // 3. Initialize navigation hook
  const navigate = useNavigate();
  
  // Initialize the useNarrator hook (Zero-Knowledge, On-Device)
  const { speakText, isSpeaking, stopSpeaking } = useNarrator();

  // (handleAccessibilityCardTap and handleGetAccessTap functions unchanged)

  /**
   * FIX: Handle Closing the Modal and Navigating to the App
   */
  const handleCloseModal = () => {
    // 4. A11Y CORE: Stop speaking immediately on a tap
    stopSpeaking(); 
    
    // 5. Hide the modal state
    setIsAccessModalOpen(false);
    
    // 6. Navigate to the main dashboard (or symptom logger route)
    // For this iPad pre-release, we will link directly to the Symptom Logger.
    navigate('/symptom-logger'); 
    
    console.log('MSConnect Demo acknowledged. Navigating to Symptom Logger workflow.');
  };

  return (
    <div style={a11yStyles.container}>
      {/* Brand Header */}
      <h1 style={a11yStyles.mainHeader}>MSConnect: Private. Accessible. Yours.</h1>

      {/* Founder Message Section */}
      <section style={{ backgroundColor: '#EEF2F4', padding: '2rem', borderRadius: '12px', textAlign: 'center', maxWidth: '800px' }}>
        <h2 style={{ color: '#D98C58', fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>A Personal Message from the Developer</h2>
        <p style={{ ...a11yStyles.cardText, color: '#374151', marginTop: '1rem', fontStyle: 'italic' }}>
          "Designed and engineered by an individual living with Multiple Sclerosis. This app is built to manage the challenges of our community on your terms."
        </p>
      </section>

      {/* Feature Section */}
      <div style={a11yStyles.featureGrid}>
        <FeatureCard 
          icon="🛡️" 
          title="Privacy First" 
          description="Your health notes stay on your device. Zero-Knowledge architecture ensures we never see your data." 
        />
        
        {/* Link this card to the handleAccessibilityCardTap function */}
        <FeatureCard 
          icon="👓" 
          title="Designed for Bad Days" 
          description="Large touch targets, reduced motion, and voice-assisted controls that adapt to you." 
          onTap={handleAccessibilityCardTap} // Call the speak function on a large tap
        />
        
        <FeatureCard 
          icon="🧠" 
          title="Stay Mindful" 
          description="Log symptoms in seconds, track mood, and keep your mind sharp with gentle cognitive games." 
        />
        <FeatureCard 
          icon="🩺" 
          title="Doctor Reports" 
          description="Click one button to generate a clean PDF summary of your trends, ready for your neurologist." 
        />
      </div>
      
      {/* ... (Developer Seeding Button unchanged, development only) ... */}

      {/* The Main CTA Button */}
      <button 
        style={a11yStyles.callToActionButton} 
        onClick={handleGetAccessTap} 
      >
        {isSpeaking ? 'Demonstration Active...' : 'Get Early Access'}
      </button>

      {/* The Access Modal (Demonstration Workflow) */}
      {isAccessModalOpen && (
        <div style={modalStyles.overlay} onClick={handleCloseModal}>
          {/* stopPropagation ensures tapping the modal content doesn't close it */}
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalStyles.title}>Welcome to MSConnect (Demo)</h2>
            <p style={modalStyles.text}>
              "MS Connect is designed and built by an individual living with Multiple Sclerosis. Our core promise is that your health data is private, secured directly on this iPad, and never leaves your control."
            </p>
            
            {/* HUGE, calming close button for tremors. THIS is what was broken. */}
            <button style={modalStyles.closeButton} onClick={handleCloseModal}>
              Acknowledge Demonstration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

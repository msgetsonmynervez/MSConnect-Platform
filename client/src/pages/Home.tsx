// /client/src/pages/Home.tsx (FULL, RESTORED, SAFEGUARDED A11Y CODE)
import React, { useState } from 'react';
import { useNarrator } from '../hooks/useNarrator'; // Zero-Knowledge, On-Device Service

/**
 * Peaceful A11y Styles (Sage Green/Slate Gray)
 * HUGE padding and massive fonts for tremors and dysarthria.
 */
const a11yStyles = {
  container: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2.5rem',
    backgroundColor: 'white', // Bright, neutral canvas
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  mainHeader: {
    color: '#3C5A51', // Sage Green (Peaceful Brand Header)
    fontSize: '3rem', // Massive
    fontWeight: '900',
    textAlign: 'center' as const,
    margin: 0,
    lineHeight: '1.2',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
  },
  callToActionButton: {
    // HUGE target for tremors: 3rem padding
    padding: '2rem 3rem',
    fontSize: '2rem',
    fontWeight: '700',
    backgroundColor: '#3C5A51', // Sage Green
    color: 'white',
    border: 'none',
    borderRadius: '16px', // Large corners
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)', // Reduced motion (subtle)
    cursor: 'pointer',
    marginTop: '3rem',
    // Minimal motion on tap for dysarthria needs
    transform: 'translateY(0)',
  },
  // Feature card text needs to be massive for dysarthria/sensory needs
  cardText: {
    color: '#374151', // Slate Gray (Lower contrast, peaceful text)
    fontSize: '1.2rem',
    lineHeight: '1.6',
    margin: 0,
  }
};

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
 * Internal Feature Card Prop Definition (Minimal cognitive load)
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onTap?: () => void; // Optional callback for interaction
}

/**
 * FeatureCard Component (Internal A11y target)
 * - HUGE touch target via padding
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onTap }) => {
  const cardStyle = {
    backgroundColor: '#EEF2F4', // Ultra-soft light slate
    padding: '2.5rem', // LARGE target
    borderRadius: '20px',
    border: '1px solid #D1D5DB', // Subtle edge for sensory stability
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'start',
    gap: '1rem',
    textAlign: 'left' as const,
    cursor: onTap ? 'pointer' : 'default', // Visual hint for interactors
  };

  return (
    <div style={cardStyle} onClick={onTap}>
      <span style={{ fontSize: '3rem', margin: 0 }}>{icon}</span>
      <h3 style={{ color: '#3C5A51', fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>{title}</h3>
      <p style={a11yStyles.cardText}>{description}</p>
    </div>
  );
};

/**
 * Home Component (Landing Page)
 */
const Home: React.FC = () => {
  // 1. State for the Access Modal
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  
  // Initialize the useNarrator hook (Zero-Knowledge, On-Device)
  const { speakText, isSpeaking, stopSpeaking } = useNarrator();

  /**
   * Internal accessibility card tapping logic (Minimal cognitive load)
   * This logic is defined *inside* Home for complete stability on iPad.
   */
  const handleAccessibilityCardTap = () => {
    speakText("Designed and built by an individual living with Multiple Sclerosis. Our core promise is that your health data is private, secured directly on this device, and never leaves your control.");
    console.log('Accessibility demonstration activated via voice.');
  };

  /**
   * Handle Tapping the Main CTA (Opens Demo Modal)
   */
  const handleGetAccessTap = () => {
    // A11Y CORE: Stop speaking immediately on a new tap
    stopSpeaking(); 
    
    // Open the demonstration modal overlay
    setIsAccessModalOpen(true);
    
    // Announce the demo modal (Sensory calibration, calm voice)
    speakText("Welcome to MS Connect. Tap Acknowledge Demonstration to close.");
    
    console.log('Get Access demonstration modal activated.');
  };

  /**
   * Handle closing the demonstration modal
   */
  const handleCloseModal = () => {
    // A11Y CORE: Stop speaking immediately on a tap
    stopSpeaking(); 
    
    // Hide the modal state
    setIsAccessModalOpen(false);
    
    console.log('MSConnect Demo modal acknowledged and closed.');
  };

  return (
    <div style={a11yStyles.container}>
      {/* Brand Header */}
      <h1 style={a11yStyles.mainHeader}>MSConnect: Private. Accessible. Yours.</h1>

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
            
            {/* HUGE, calming close button for tremors */}
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

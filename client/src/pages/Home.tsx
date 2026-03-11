// /src/pages/Home.tsx
import React, { useState } from 'react';
// 1. Import the Hooks and Services we just built
import { useNarrator } from '../hooks/useNarrator'; 
import { seedSymptomDatabase } from '../utils/seedIndexedDB'; 

/**
 * Common Styles for High Accessibility (A11y)
 * - Optimized for iPad Touch (No hover)
 * - Defined as a JS object for rapid "Adaptive UI" changes.
 */
const a11yStyles = {
  container: {
    backgroundColor: '#F9FAFB', // Calm, soft gray
    color: '#111827', // Dark gray for high contrast, softer than black
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif', // Optimized for Apple devices
    padding: '3rem 2rem', // Increased padding for comfort
    // iPad "Safe Area" padding for devices with Home indicators (e.g., iPad Pro)
    paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem',
    // Smooth scrolling for iPadOS
    WebkitOverflowScrolling: 'touch' as const, 
  },
  mainHeader: {
    color: '#3C5A51', // Sage Green
    fontSize: '3rem', // Massive header for low vision/fog
    fontWeight: '900',
    borderBottom: '4px solid #D98C58', // Thicker, bold underline
    paddingBottom: '1.5rem',
    width: '100%',
    maxWidth: '1200px',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    // Force a stable 2-column layout on iPad to maximize touch target width
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '2.5rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2.5rem', // Maximum padding for stable touch target
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    cursor: 'pointer', // Touch indicator
    // Explicit tap feedback color for iPad (Subtle Terracotta)
    WebkitTapHighlightColor: 'rgba(217, 140, 88, 0.2)',
  },
  cardIcon: {
    fontSize: '3.5rem', // Large icon
    color: '#D98C58', // Terracotta
    marginBottom: '1rem',
  },
  cardTitle: {
    color: '#111827',
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0,
  },
  cardText: {
    color: '#374151', // Higher contrast
    fontSize: '1.4rem', // Large body text for sensory fatigue
    lineHeight: '1.8', // Calm line height
    margin: 0,
  },
  callToActionButton: {
    backgroundColor: '#3C5A51', // Sage Green
    color: 'white',
    padding: '1.8rem 4rem', // Big, stable touch target (min-height 48px)
    fontSize: '1.6rem',
    fontWeight: '800',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    // iPad Safe Area padding for fixed bottom placement if needed
    marginBottom: 'env(safe-area-inset-bottom)',
  },
};

/**
 * Access Modal Styles (Fixed Syntax Error)
 * - Focused on reducing sensory input.
 * - Simple text, large touch targets, minimal visual noise.
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
    // --- FIX: Syntax error r ---
    margin: '0 0 1rem 0', // Top, Right, Bottom, Left (JS string notation)
  },
  text: {
    color: '#374151', // Higher contrast
    fontSize: '1.4rem',
    lineHeight: '1.8',
    // --- FIX: Syntax error r ---
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
 * FeatureCard Component (Internal)
 * - Accepts an 'onTap' prop to trigger the narrator on the whole card.
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onTap?: () => void; // Optional function
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onTap }) => (
  // Attach the onTap (speakText) function to the card's onClick handler
  <div style={a11yStyles.featureCard} onClick={onTap}>
    <div style={a11yStyles.cardIcon}>{icon}</div>
    <h3 style={a11yStyles.cardTitle}>{title}</h3>
    <p style={a11yStyles.cardText}>{description}</p>
  </div>
);

/**
 * Home Component (Landing Page)
 */
const Home: React.FC = () => {
  // State for the Access Modal
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  
  // Initialize the useNarrator hook (Zero-Knowledge, On-Device)
  const { speakText, isSpeaking, stopSpeaking } = useNarrator();

  /**
   * Handle Tapping the "Designed for Bad Days" Card
   */
  const handleAccessibilityCardTap = () => {
    // Construct the summary text we want to read aloud.
    const narrativeText = "MS Connect is designed for your bad days. On days with visual fatigue, this feature provides voice assisted controls that adapt to you.";
    
    // Speak the text (This uses the native device engine, keeping it private)
    speakText(narrativeText);
  };

  /**
   * FIX: Handle 'Get Early Access' Button Tap
   */
  const handleGetAccessTap = () => {
    // Open the Modal
    setIsAccessModalOpen(true);
    
    // Construct the Narrative Summary (Demonstration)
    const narrativeText = "MS Connect is your on device neurology partner. We are strictly private and adaptive. In this special pre release, we show you how we assist with visual fatigue or tremors, directly on your iPad.";
    
    // Speak the demonstration (Client-side, Zero-Knowledge)
    speakText(narrativeText);
  };

  /**
   * Handle Closing the Modal
   */
  const handleCloseModal = () => {
    // A11Y CORE: Stop speaking immediately on a tap
    stopSpeaking(); 
    setIsAccessModalOpen(false);
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
      
      {/* TEMPORARY SEEDING BUTTON (DEVELOPMENT ONLY) */}
      {/* This ensures the button never appears for real users in production. */}
      {process.env.NODE_ENV !== 'production' && (
        <button 
          onClick={seedSymptomDatabase} 
          style={{ 
            marginTop: '3rem', 
            padding: '1.5rem 2.5rem', 
            backgroundColor: '#FF6347', // Tomato Red (Dev Only)
            color: 'white',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer'
          }}>
          🚧 DEVELOPER: Seed iPad DB (75 Logs)
        </button>
      )}

      {/* The Main CTA Button (Now linked to our fix handler) */}
      <button 
        style={a11yStyles.callToActionButton} 
        onClick={handleGetAccessTap} // Attach the fix handler
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
            
            {/* LARGE, clear button to close the modal and stop speech (Safety feature). */}
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

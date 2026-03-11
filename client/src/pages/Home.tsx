// /src/pages/Home.tsx
import React from 'react';
// 1. Import the Hook we just created
import { useNarrator } from '../hooks/useNarrator'; 

/**
 * Common Styles for High Accessibility (A11y)
 * - Defined as a JS object for rapid "Adaptive UI" changes.
 */
const a11yStyles = {
  container: {
    backgroundColor: '#F9FAFB', // Calm, soft gray
    color: '#111827', // Dark gray for high contrast, but softer than black
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '2.5rem 1.5rem',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
  },
  mainHeader: {
    color: '#3C5A51', // Sage Green
    fontSize: '2.8rem',
    fontWeight: '800',
    borderBottom: '3px solid #D98C58', // Terracotta underline
    paddingBottom: '1rem',
    width: '100%',
    maxWidth: '1200px',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer', // Large touch target visual cue
  },
  cardIcon: {
    fontSize: '2.5rem',
    color: '#D98C58', // Terracotta
    marginBottom: '0.5rem',
  },
  cardTitle: {
    color: '#111827',
    fontSize: '1.6rem',
    fontWeight: '700',
    margin: 0,
  },
  cardText: {
    color: '#6B7280', // Softened text for readablity
    fontSize: '1.2rem',
    lineHeight: '1.7',
    margin: 0,
  },
  callToActionButton: {
    backgroundColor: '#3C5A51', // Sage Green
    color: 'white',
    padding: '1.5rem 3rem',
    fontSize: '1.4rem',
    fontWeight: '700',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    transition: 'background-color 0.2s ease',
  },
};

/**
 * FeatureCard Component (Internal)
 * - Accepts an 'onTap' prop to trigger the narrator.
 */
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onTap?: () => void; // Optional function
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, onTap }) => (
  // 2. Attach the onTap (speakText) function to the card's onClick handler
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
  // 3. Initialize the useNarrator hook
  const { speakText, isSpeaking } = useNarrator();

  /**
   * Handle Tapping the "Designed for Bad Days" Card
   */
  const handleAccessibilityCardTap = () => {
    // 4. Construct the summary text we want to read aloud.
    const narrativeText = "MS Connect is designed for your bad days. On days with visual fatigue, this feature provides voice assisted controls that adapt to you.";
    
    // 5. Speak the text (This uses the native device engine, keeping it private)
    speakText(narrativeText);
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

      {/* Feature Section - Simple and Direct */}
      <div style={a11yStyles.featureGrid}>
        <FeatureCard 
          icon="🛡️" 
          title="Privacy First" 
          description="Your health notes stay on your device. Zero-Knowledge architecture ensures we never see your data." 
        />
        
        {/* 6. Link this card to the handleAccessibilityCardTap function */}
        <FeatureCard 
          icon="👓" 
          title="Designed for Bad Days" 
          description="Large touch targets, reduced motion, and voice-assisted controls that adapt to you." 
          onTap={handleAccessibilityCardTap} // Call the speak function
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

      {/* Call to Action Button */}
      <button style={a11yStyles.callToActionButton}>
        {/* Optional: Add a subtle visual state change if speaking */}
        {isSpeaking ? 'Narrator Active...' : 'Get Early Access'}
      </button>
    </div>
  );
};

export default Home;

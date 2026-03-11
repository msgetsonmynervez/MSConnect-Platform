// /src/pages/Home.tsx (UPDATED: Fixing the broken CTA button)
import React, { useState } from 'react'; // 1. Import useState for the modal
import { useNarrator } from '../hooks/useNarrator'; 
import { seedSymptomDatabase } from '../utils/seedIndexedDB'; 

// ... (Rest of a11yStyles are unchanged)

/**
 * Access Modal Styles (Peaceful A11y Design)
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
    margin: [0, 0, 1rem, 0], // Top, Right, Bottom, Left
  },
  text: {
    color: '#374151', // Higher contrast
    fontSize: '1.4rem',
    lineHeight: '1.8',
    margin: [0, 0, 2rem, 0],
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
  const { speakText, isSpeaking, stopSpeaking } = useNarrator();

  // (handleAccessibilityCardTap function is unchanged)

  /**
   * FIX: Handle 'Get Early Access' Button Tap
   */
  const handleGetAccessTap = () => {
    // 3. Open the Modal
    setIsAccessModalOpen(true);
    
    // 4. Construction the Narrative Summary (Demonstration)
    const narrativeText = "MS Connect is your on device neurology partner. We are strictly private and adaptive. In this special pre release, we show you how we assist with visual fatigue or tremors, directly on your iPad.";
    
    // 5. Speak the demonstration (Client-side, Zero-Knowledge)
    speakText(narrativeText);
  };

  /**
   * Handle Closing the Modal
   */
  const handleCloseModal = () => {
    // 6. Stop speaking immediately on a tap
    stopSpeaking(); 
    setIsAccessModalOpen(false);
  };

  return (
    <div style={a11yStyles.container}>
      {/* (Brand Header and Founder Message unchanged) */}

      {/* Feature Section */}
      <div style={a11yStyles.featureGrid}>
        {/* ... (First three feature cards unchanged) */}
        
        <FeatureCard 
          icon="🩺" 
          title="Doctor Reports" 
          description="Click one button to generate a clean PDF summary of your trends, ready for your neurologist." 
        />
      </div>
      
      {/* ... (Developer Seeding Button unchanged, development only) */}

      {/* 7. The Main CTA Button (Now linked to our handler) */}
      <button 
        style={a11yStyles.callToActionButton} 
        onClick={handleGetAccessTap} // Attach the fixed handler
      
      >
        {isSpeaking ? 'Demonstration Active...' : 'Get Early Access'}
      </button>

      {/* 8. The Access Modal (Demonstration Workflow) */}
      {isAccessModalOpen && (
        <div style={modalStyles.overlay} onClick={handleCloseModal}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalStyles.title}>Welcome to MSConnect (Demo)</h2>
            <p style={modalStyles.text}>
              "MS Connect is designed and built by an individual living with Multiple Sclerosis. Our core promise is that your health data is private, secured directly on this iPad, and never leaves your control."
            </p>
            
            {/* LARGE, clear button to close the modal and stop speech. */}
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

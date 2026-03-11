// /src/pages/Home.tsx (UPDATED for iPad Touch/Safari)
import React from 'react';
import { useNarrator } from '../hooks/useNarrator'; 

/**
 * IPAD-OPTIMIZED A11Y STYLES
 * - Wide touch targets (min-height: 48px)
 * - Safe Area insets for modern iPads
 * - Explicit Webkit definitions for Safari stability.
 */
const a11yStyles = {
  container: {
    backgroundColor: '#F9FAFB',
    color: '#111827',
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
    WebkitOverflowScrolling: 'touch', 
  },
  mainHeader: {
    color: '#3C5A51',
    fontSize: '3rem', // Massive header for clarity
    fontWeight: '900',
    borderBottom: '4px solid #D98C58', // Thicker underline for emphasis
    paddingBottom: '1.5rem',
    width: '100%',
    maxWidth: '1200px',
    textAlign: 'center',
  },
  featureGrid: {
    display: 'grid',
    // Force a 2-column layout on iPad (minmax 450px) to maximize touch target width.
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
    cursor: 'pointer',
    // Clear visual feedback on TAPS (active state) on iPad
    WebkitTapHighlightColor: 'rgba(217, 140, 88, 0.2)', // Subtile Terracotta highlight
  },
  // (Rest of styles remain the same but use increased sizes/padding)
  cardIcon: {
    fontSize: '3.5rem',
    color: '#D98C58',
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
    fontSize: '1.4rem', // Large body text for reading fatigue
    lineHeight: '1.8',
    margin: 0,
  },
  callToActionButton: {
    backgroundColor: '#3C5A51',
    color: 'white',
    padding: '1.8rem 4rem', // Big, stable button target
    fontSize: '1.6rem',
    fontWeight: '800',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    // iPad Safe Area padding for fixed bottom placement if needed
    marginBottom: 'env(safe-area-inset-bottom)',
  },
};

// ... (Rest of the Home.tsx code for handleAccessibilityCardTap is unchanged)

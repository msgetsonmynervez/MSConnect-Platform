
// /src/hooks/useNarrator.ts
import { useState, useCallback, useEffect } from 'react';

/**
 * useNarrator Hook
 * - Utilizes the native Web Speech API (SpeechSynthesis)
 * - Calms the output rate and pitch for MS sensory needs.
 * - Adheres to Zero-Knowledge architecture (On-device processing).
 */
export const useNarrator = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synth = window.speechSynthesis; // Access the native synthesis engine

  /**
   * Speak Text (Core Function)
   * - Sets specific parameters to avoid overwhelming auditory input.
   */
  const speakText = useCallback((textToSpeak: string) => {
    if (!synth) {
      console.error('Speech synthesis is not supported in this browser.');
      return;
    }

    // Cancel any current speech immediately
    synth.cancel();

    // Create the "Utterance" (The thing to speak)
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // --- ACCESSIBILITY CALIBRATION (CRITICAL) ---
    // Rate: Default is 1.0 (Normal). 
    // 0.85-0.9 is often better for processing speed/dysarthria needs.
    utterance.rate = 0.88; 

    // Pitch: Default is 1.0. Lowering slightly (e.g., 0.95) can be less fatiguing.
    utterance.pitch = 0.98;

    // Optional: We can attempt to select a specific voice later.
    // utterance.voice = voices[0];
    
    // Set state for visual indicator
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech Synthesis Error:', event.error);
      setIsSpeaking(false);
    };

    // Begin speaking
    synth.speak(utterance);
  }, [synth]);

  /**
   * Stop Speaking (Safety Feature)
   * - Allows the user to silence the app instantly.
   */
  const stopSpeaking = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [synth]);

  /**
   * Cleanup on Unmount
   * - Important: Silence the app if the user navigates away mid-speech.
   */
  useEffect(() => {
    return () => {
      if (synth) {
        synth.cancel();
      }
    };
  }, [synth]);

  return { speakText, stopSpeaking, isSpeaking };
};

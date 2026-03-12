import { useState, useCallback } from 'react';

export function useNarrator() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = useCallback((text: string) => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Set a calm, slow pace for MS cognitive accessibility
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speakText, isSpeaking, stopSpeaking };
}

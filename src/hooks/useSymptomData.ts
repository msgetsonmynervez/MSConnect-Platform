import { useState, useEffect } from 'react';

export function useSymptomData() {
  const [symptoms, setSymptoms] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ms_symptoms');
      if (saved) setSymptoms(JSON.parse(saved));
    } catch (e) {
      console.error("Local data corrupted, resetting securely.");
      localStorage.setItem('ms_symptoms', JSON.stringify([]));
    }
  }, []);

  const addSymptom = (entry: any) => {
    const updated = [...symptoms, { ...entry, id: Date.now() }];
    setSymptoms(updated);
    localStorage.setItem('ms_symptoms', JSON.stringify(updated));
  };

  return { symptoms, addSymptom };
}

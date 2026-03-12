import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the energy levels for MS accessibility
type EnergyLevel = 'high' | 'medium' | 'low';

interface EnergyContextType {
  energy: EnergyLevel;
  setEnergy: (level: EnergyLevel) => void;
}

const EnergyContext = createContext<EnergyContextType | undefined>(undefined);

export const EnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [energy, setEnergy] = useState<EnergyLevel>('high');

  // Load saved energy preference from local device (Zero-Knowledge)
  useEffect(() => {
    const saved = localStorage.getItem('ms_energy_pref') as EnergyLevel;
    if (saved) setEnergy(saved);
  }, []);

  const updateEnergy = (level: EnergyLevel) => {
    setEnergy(level);
    localStorage.setItem('ms_energy_pref', level);
  };

  return (
    <EnergyContext.Provider value={{ energy, setEnergy: updateEnergy }}>
      <div className={`energy-mode-${energy}`}>
        {children}
      </div>
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => {
  const context = useContext(EnergyContext);
  if (!context) throw new Error('useEnergy must be used within EnergyProvider');
  return context;
};

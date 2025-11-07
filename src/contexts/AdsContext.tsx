'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdsContextType {
  adsEnabled: boolean;
  toggleAds: () => void;
}

const AdsContext = createContext<AdsContextType | undefined>(undefined);

export function AdsProvider({ children }: { children: ReactNode }) {
  const [adsEnabled, setAdsEnabled] = useState(true);

  const toggleAds = () => {
    setAdsEnabled(prev => !prev);
  };

  return (
    <AdsContext.Provider value={{ adsEnabled, toggleAds }}>
      {children}
    </AdsContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdsContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
}

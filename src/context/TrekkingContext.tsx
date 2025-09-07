'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface TrekkingContextType {
  siteTitle: string;
  setSiteTitle: (title: string) => void;
  backgroundImage: string;
  setBackgroundImage: (image: string) => void;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

const TrekkingContext = createContext<TrekkingContextType | undefined>(undefined);

export function TrekkingProvider({ children }: { children: ReactNode }) {
  const [siteTitle, setSiteTitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [currentRoute, setCurrentRoute] = useState('');

  return (
    <TrekkingContext.Provider
      value={{
        siteTitle,
        setSiteTitle,
        backgroundImage,
        setBackgroundImage,
        currentRoute,
        setCurrentRoute,
      }}
    >
      {children}
    </TrekkingContext.Provider>
  );
}

export function useTrekkingContext() {
  const context = useContext(TrekkingContext);
  if (!context) {
    throw new Error('useTrekkingContext must be used within a TrekkingProvider');
  }
  return context;
}
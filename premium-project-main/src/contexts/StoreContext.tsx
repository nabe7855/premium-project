'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Store } from '@/lib/store/store-data';

interface StoreContextType {
  store: Store;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  store: Store;
  children: ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  return <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

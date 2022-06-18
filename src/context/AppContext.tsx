import React, { createContext, useState, useContext } from 'react';
import { AppContextData } from '@/model/contexts/app/AppContextData';
import { AppContextProviderProps } from '@/model/contexts/app/AppContextProviderProps';

export const AppContext = createContext({} as AppContextData);

export function AppProvider({ children }: AppContextProviderProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading
      }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  return useContext(AppContext);
}
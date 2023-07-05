import React, { createContext, useState, useContext, useMemo } from 'react';
import { AppContextData } from '@/model/contexts/app/AppContextData';
import { AppContextProviderProps } from '@/model/contexts/app/AppContextProviderProps';
import { UserInfo } from '@/services/umobi/models/UserInfo';
import moment from 'moment';
import { Camp } from '@/model/entities/Camp';

const USER_INFO_INITIAL_STATE = {
  address: '',
  birthDate: moment().utc().format('DD/MM/yyyy'),
  email: '',
  name: '',
  parentNames: '',
  phoneNumber: '',
  registrations: []
} as UserInfo;

export const AppContext = createContext({} as AppContextData);

export function AppProvider({ children }: AppContextProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(USER_INFO_INITIAL_STATE);
  const [events, setEvents] = useState<Camp[]>([]);

  const hasAvailableEvents = useMemo(() => {
    const registations = userInfo?.registrations?.map(r => r.campId) || [];
    const availableEventCount = events?.filter(f => !registations.includes(f.id)).length;

    return availableEventCount > 0;
  }, [userInfo.registrations, events]);

  const logout = () => {
    setIsLoading(true);
    setUserInfo(USER_INFO_INITIAL_STATE);
    setEvents([]);
    setIsLoading(false);
  }

  return (
    <AppContext.Provider
      value={{
        isLoading,
        userInfo,
        events,
        hasAvailableEvents,
        setIsLoading,
        setUserInfo,
        setEvents,
        logout
      }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  return useContext(AppContext);
}
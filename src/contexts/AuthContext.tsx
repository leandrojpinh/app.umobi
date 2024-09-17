'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { setCookie, destroyCookie } from 'nookies';

import { AuthContextData } from '@/model/contexts/auth/AuthContextData';
import AuthContextProviderProps from '@/model/contexts/auth/AuthContextProviderProps';
import { User, Cookie } from '@/model/contexts/auth/User';

import { createSession } from '@/services/umobi/umobi.api';
import { Session } from '@/services/umobi/models/Session';
import { AxiosError } from 'axios';
import { Token } from '@/services/umobi/models/Token';
import { useRouter } from 'next/navigation';

const INITIAL_USER_STATE = {
  isAuthenticated: false,
  name: '',
  email: '',
  id: '',
  isAdmin: false,
  isViewer: false,
  refreshToken: '',
  token: ''
} as User;

const parseJwt = (token: string) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');

  return JSON.parse(window.atob(base64));
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export function AuthProvider({ children }: AuthContextProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(INITIAL_USER_STATE);
  const [loading, setLoading] = useState(false);

  const signIn = (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      const session = { email, password } as Session;
      createSession(session)
        .then((response: Token) => {
          const tokenParsed = parseJwt(response.token);
          const loggedUser = {
            email: response.user?.email,
            name: response.user?.name,
            isAuthenticated: true,
            refreshToken: response.refreshToken,
            token: response.token,
            isAdmin: response.user?.isAdmin,
            isViewer: response.user?.isViewer,
            id: tokenParsed.sub
          } as User;

          setCookie(undefined, Cookie.umobiToken, loggedUser.token, {
            maxAge: 60 * 60 * 4, //4 hours
          });

          setUser(loggedUser);

          resolve(true);
        })
        .catch((err: AxiosError) => {
          toast.error(`Hmmm!, ${err.response?.status === 400 ?
            'e-mail ou senha incorretos, verifique e tente novamente.' :
            'Houve problema na comunicação, tenta de novo.'}`);

          reject();
        }).finally(() => setLoading(false));
    });
  }

  const signOut = () => {
    setLoading(true);
    destroyCookie(undefined, Cookie.umobiToken);
    setUser(INITIAL_USER_STATE);
    setLoading(false);
    router.push('/');
  }

  useEffect(() => {
    if (!user.isAuthenticated) {
      signOut();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      setUser
    }
    }>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
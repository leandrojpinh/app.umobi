'use client'

import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { EmailProvider } from './EmailProvider';
import ToastProvider from './ToastProvider';

export function Providers({ children }: any) {
  return (
    <AppProvider>
      <AuthProvider>
        <EmailProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </EmailProvider>
      </AuthProvider>
    </AppProvider>
  )
}
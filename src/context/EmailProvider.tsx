import React, { createContext, useState, useContext } from 'react';
import { send } from 'emailjs-com';
import { EmailContextData } from '@/model/contexts/email/EmailContextData';
import { EmailContextProviderProps } from '@/model/contexts/email/EmailContextProviderProps';
import { Email } from '@/model/contexts/email/Email';

import { emailConfig } from '@/services/email/email';

export const EmailContext = createContext({} as EmailContextData);

export function EmailProvider({ children }: EmailContextProviderProps) {
  const [isSending, setIsSending] = useState(false);

  async function sendRegistration(email: Email) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.registrationTemplateId, email);
      if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail de inscrição.');
      }

      setIsSending(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function sendConfirmation(email: Email) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.confirmationTemplateId, email);
      if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail de confirmação.');
      }

      setIsSending(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function sendRejection(email: Email) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.rejectTemplateId, email);
      if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail de confirmação.');
      }

      setIsSending(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function sendAdjustment(email: Email) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.adjustTemplateId, email);
      if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail de correção do comprovante.');
      }

      setIsSending(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function sendReset(email: Email) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.resetTemplateId, email);
      if (response.status !== 200) {
        throw new Error('Erro ao enviar e-mail de inscrição.');
      }

      setIsSending(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <EmailContext.Provider
      value={{
        isSending,
        sendRegistration,
        sendConfirmation,
        sendRejection,
        sendAdjustment,
        sendReset
      }}>
      {children}
    </EmailContext.Provider>
  );
}

export const useEmail = () => {
  return useContext(EmailContext);
}
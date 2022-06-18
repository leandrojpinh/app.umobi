import React, { createContext, useState, useContext } from 'react';
import { send } from 'emailjs-com';
import { EmailContextData } from '@/model/contexts/email/EmailContextData';
import { EmailContextProviderProps } from '@/model/contexts/email/EmailContextProviderProps';
import { EmailConfirmation } from '@/model/contexts/email/Email';

import { emailConfig } from '@/services/email/email';

export const EmailContext = createContext({} as EmailContextData);

// sendAdjustment(email)
//       .then(_ => {
//         toast.success('E-mail adjustment!')
//       }).catch(err => console.log('sendNew', err));

//     sendNew(10)
//       .then(_ => {
//         toast.success('E-mail send enviado!')
//       }).catch(err => console.log('sendNew', err));

//     sendConfirmation({
//       email: 'leandro-jpinh@hotmail.com',
//       name: 'Leandro',
//       data: new Date().toLocaleString()
//     }).then(_ => {
//       toast.success('Valor do comprovante confirmado!');
//     }).catch(err => console.log(err));

//     sendRejection({
//       email: 'leandro-jpinh@hotmail.com',
//       name: 'Leandro',
//       data: new Date().toLocaleString()
//     }).then(_ => {
//       toast.success('Valor do comprovante rejeitado, enviamos um e-mail para correção.');
//     }).catch(err => console.log(err));

export function EmailProvider({ children }: EmailContextProviderProps) {
  const [isSending, setIsSending] = useState(false);

  // async function sendCode(email: EmailCode) {
  //   try {
  //     setIsSending(true);
  //     const response = await send(emailConfig.serviceId, emailConfig.codeTemplateId, email);
  //     if (response.status !== 200) {
  //       throw new Error('Erro ao enviar e-mail de código.');
  //     }

  //     setIsSending(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async function sendConfirmation(email: EmailConfirmation) {
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

  async function sendRejection(email: EmailConfirmation) {
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

  async function sendAdjustment(email: EmailConfirmation) {
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

  async function sendNew(total: number) {
    try {
      setIsSending(true);
      const response = await send(emailConfig.serviceId, emailConfig.newTemplateId, { total });
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
        // sendCode,
        sendConfirmation,
        sendRejection,
        sendAdjustment,
        sendNew
      }}>
      {children}
    </EmailContext.Provider>
  );
}

export const useEmail = () => {
  return useContext(EmailContext);
}
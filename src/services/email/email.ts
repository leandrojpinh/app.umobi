'use server';

import UmobiRegistration, { UmobiRegistrationProps } from "@/components/email/umobi-registration";
import UmobiCode, { UmobiCodeProps } from "@/components/email/umobi-code";
import UmobiConfirmation, { UmobiConfirmationProps } from "@/components/email/umobi-confirmation";
import { Resend } from "resend";
import UmobiRejection, { UmobiRejectionProps } from "@/components/email/umobi-rejection";

export async function SendConfirmation(props: UmobiConfirmationProps) {
  console.log("process.env.RESEND_API_KEY", process.env.RESEND_API_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Confirmação de comprovante - ${props.eventName}`,
    react: UmobiConfirmation(props)
  });

  return response;
}

export async function SendCode(props: UmobiCodeProps) {
  const key = process.env.RESEND_API_KEY;
  console.log('key', key);
  const resend = new Resend(key);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Reset de senha`,
    react: UmobiCode(props)
  });

  return response;
}

export async function SendRegistration(props: UmobiRegistrationProps) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Reset de senha`,
    react: UmobiRegistration(props)
  });

  return response;
}

export async function SendRejection(props: UmobiRejectionProps) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Comprovante Rejeitado`,
    react: UmobiRejection(props)
  });

  return response;
}
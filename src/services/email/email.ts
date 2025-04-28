'use server';

import UmobiCharge, { UmobiChargeProps } from "@/templates/email/umobi-charge";
import UmobiCode, { UmobiCodeProps } from "@/templates/email/umobi-code";
import UmobiConfirmation, { UmobiConfirmationProps } from "@/templates/email/umobi-confirmation";
import UmobiRegistration, { UmobiRegistrationProps } from "@/templates/email/umobi-registration";
import UmobiRejection, { UmobiRejectionProps } from "@/templates/email/umobi-rejection";
import { Resend } from "resend";

export async function SendConfirmation(props: UmobiConfirmationProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Umobi | Confirmação de comprovante - ${props.eventName}`,
    react: UmobiConfirmation(props)
  });

  return response;
}

export async function SendCode(props: UmobiCodeProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Umobi | Reset de senha`,
    react: UmobiCode(props)
  });

  return response;
}

export async function SendRegistration(props: UmobiRegistrationProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Umobi | Inscrição Recebida`,
    react: UmobiRegistration(props)
  });

  return response;
}

export async function SendRejection(props: UmobiRejectionProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Umobi | Comprovante Rejeitado`,
    react: UmobiRejection(props)
  });

  return response;
}

export async function SendCharge(props: UmobiChargeProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: 'inscricao@umobice.com.br',
    to: props.email!,
    subject: `Umobi | Lembrete`,
    react: UmobiCharge(props)
  });

  return response;
}
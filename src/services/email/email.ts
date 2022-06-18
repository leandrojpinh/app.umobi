import { init } from 'emailjs-com';

export const emailConfig = {
  userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
  token: process.env.NEXT_PUBLIC_EMAILJS_TOKEN,
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  codeTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CODE_TEMPLATE_ID || '',
  confirmationTemplateId: process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID || '',
  rejectTemplateId: process.env.NEXT_PUBLIC_EMAILJS_REJECTION_TEMPLATE_ID || '',
  adjustTemplateId: process.env.NEXT_PUBLIC_EMAILJS_ADJUST_TEMPLATE_ID || '',
  newTemplateId: process.env.NEXT_PUBLIC_EMAILJS_NEW_TEMPLATE_ID || '',
};

init(emailConfig.userId || '');

console.log('emailConfig', emailConfig)
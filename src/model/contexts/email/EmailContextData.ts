import { Email } from "./Email";

export interface EmailContextData {
  isSending: boolean;
  sendRegistration: (registration: Email) => Promise<boolean>;
  sendConfirmation: (confirmation: Email) => Promise<boolean>;
  sendRejection: (rejection: Email) => Promise<boolean>;
  sendAdjustment: (adjustmend: Email) => Promise<boolean>;
  sendReset: (email: Email) => Promise<boolean>;
}
import { Email } from "./Email";

export interface EmailContextData {
  isSending: boolean;
  sendRegistration: (registration: Email) => Promise<void>;
  sendConfirmation: (confirmation: Email) => Promise<void>;
  sendRejection: (rejection: Email) => Promise<void>;
  sendAdjustment: (adjustmend: Email) => Promise<void>;
  sendNew: (total: number) => Promise<void>;
}
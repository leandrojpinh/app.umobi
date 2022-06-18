import { EmailConfirmation } from "./Email";

export interface EmailContextData {
  isSending: boolean;
  sendConfirmation: (confirmation: EmailConfirmation) => Promise<void>;
  sendRejection: (rejection: EmailConfirmation) => Promise<void>;
  sendAdjustment: (adjustmend: EmailConfirmation) => Promise<void>;
  sendNew: (total: number) => Promise<void>;
}
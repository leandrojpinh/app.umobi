import { User } from "@/model/entities/User";
import { Camp } from "@/model/entities/Camp";

export type Registration = {
  campId: string;
  userId: string;
  id: string;
  user: User;
  camp: Camp
};

export type RegistrationForm = {
  campId: string;
  churchName: string;
  ministerApproval: boolean;
  registrationId: string;
  ministerName: string;
  ministerNumber: string;
  isAllergic: false;
  medicineName: string;
  canSwim: boolean;
  isBeliever: boolean;
  isResponsable: boolean;
  moreInformation: string;
  isAllTrue: boolean;
  id?: string;
  registration?: Registration;
};

export type RegistrationPayment = {
  registrationId: string;
  tax: number;
  paymentMode: string;
  id?: string;
  paymentUrl?: string;
  publicPaymentUrl?: string;
  validated?: boolean;
  createdAt?: string;
  rejected?: boolean;
  reason?: string;
};

export type SummaryPayments = {
  registrations: number;
  pending: number;
  confirmed: number;
  received: number;
  uncompleted: number;
};

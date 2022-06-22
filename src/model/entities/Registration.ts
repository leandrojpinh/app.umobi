export type RegistrationProps = {
  campId: string;
  userId: string;
};

export type RegistrationFormProps = {
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
};

export type RegistrationPaymentProps = {
  registrationId: string;
  tax: number;
  paymentMode: string;
};

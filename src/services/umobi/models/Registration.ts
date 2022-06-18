export type Registration = {
	campId: string;
  userId: string;
};

export type RegistrationForm = {
	campId: string;
	churchName: string,
  ministerApproval: boolean,
  registrationId: string,
  ministerNumber: string,
  isAllergic: false,
  medicineName: string,
  canSwim: boolean,
  isBeliever: boolean,
  isResponsable: boolean,
  moreInformation: string,
  isAllTrue: boolean
}

export type RegistrationPayment = {
  registrationId: string,
  tax: number
}
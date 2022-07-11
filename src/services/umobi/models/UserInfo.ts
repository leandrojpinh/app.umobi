import { RegistrationForm, RegistrationPayment } from "./Registration"

export type UserInfo = {
  email: string,
  name: string,
  birthDate: string,
  address: string,
  phoneNumber: string,
  parentNames: string,
  registrationId?: string,
  form?: RegistrationForm,
  payments?: RegistrationPayment[]
}
import { Registration } from "./Registration"

export type UserInfo = {
  email: string,
  name: string,
  birthDate: string,
  address: string,
  phoneNumber: string,
  parentNames: string,
  registrations: Registration[],
}
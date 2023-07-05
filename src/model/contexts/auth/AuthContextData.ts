import { User } from './User';

export type AuthContextData = {
  user: User,
  loading: boolean,
  signIn: (email: string, password: string) => Promise<boolean>,
  signOut: () => void,
  setUser: (value: User) => void
}
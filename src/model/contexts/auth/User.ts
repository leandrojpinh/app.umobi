export type User = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  refreshToken: string;
  token: string;
  isAdmin: boolean;
  isViewer: boolean;
  id: string;
}

export type SignIn = {
  email: string;
  password: string;
}

export enum Cookie {
  umobiToken = 'umobi.token'
}
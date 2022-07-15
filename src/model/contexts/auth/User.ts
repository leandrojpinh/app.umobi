export type User = {
  name: string;
  email: string;
  isAuthenticated: boolean;
  refreshToken: string;
  token: string;
  isAdmin: boolean;
  isViewer: boolean;
}

export type Login = {
  email: string;
  password: string;
}

export enum Cookie {
  umobiToken = 'umobi.token'
}
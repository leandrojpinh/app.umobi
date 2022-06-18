export type Token = {
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
  };
  token: string;
  refreshToken: string;
};

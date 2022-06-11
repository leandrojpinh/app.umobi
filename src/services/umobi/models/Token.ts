export type Token = {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refreshToken: string;
};

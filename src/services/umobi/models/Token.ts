export type Token = {
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
    isViewer: boolean;
  };
  token: string;
  refreshToken: string;
};

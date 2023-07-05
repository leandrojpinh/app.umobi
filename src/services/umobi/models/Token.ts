export type Token = {
  user: {
    name: string;
    email: string;
    isAdmin: boolean;
    isViewer: boolean;
    id: string;
  };
  token: string;
  refreshToken: string;
};

import axios, { AxiosResponse, AxiosBasicCredentials } from "axios";
import { Camp } from "./models/Camp";
import { Registration, RegistrationForm } from "./models/Registration";
import { Session } from "./models/Session";
import { Token } from "./models/Token";
import { User } from "./models/User";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

const apiHeader = (token: string) => {
  api.defaults.headers.common = { Authorization: `bearer ${token}` };
};

const createUser = async (user: User) => {
  console.log('AS', {defaults: api.defaults, user});
  const response: User = await api.post("/users", user);
  return response;
};

const createSession = async (session: Session) => {
  const response: AxiosResponse<Token> = await api.post("/sessions", session);
  if (response.status === 200) {
    apiHeader(response.data.token);
  }

  return response.data.user;
};

const getCamp = async () => {
  const response: AxiosResponse<Camp> = await api.get(`/camps`);

  return response.data;
};

const createRegistration = async (form: RegistrationForm) => {
  const camp = await getCamp();
  if (camp) {
    const registration = { campId: camp.id } as Registration;
    const registrationId = await api.post("/registrations", registration);

    if (registrationId.status === 201) {
      const registrationForm = await api.post("/registrations/form", form);

      if (registrationForm.status === 201) {
        //SUCCESS
        return true;
      }
    }
  }

  return false;
};

export {
  api,
  createRegistration,
  createSession,
  createUser,
};

import { LOCAL_STORAGE } from "@/constants/Storage";
import axios, { AxiosResponse } from "axios";
import { Camp } from "./models/Camp";
import {
  Registration,
  RegistrationForm,
  RegistrationPayment,
} from "./models/Registration";
import { Session } from "./models/Session";
import { Token } from "./models/Token";
import { User } from "./models/User";
import { UserInfo } from "./models/UserInfo";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_UMOBI,
  // baseURL: "https://api.umobice.com.br",
});

const apiHeader = (token: string) => {
  api.defaults.headers.common = { Authorization: `bearer ${token}` };
};

const createUser = (user: User) => {
  return new Promise((resolve, reject) => {
    api
      .post("/users", user)
      .then((userResponse: AxiosResponse<string>) => resolve(userResponse.data))
      .then((result) => console.log("SUCCESS", result))
      .catch((err) => {
        console.log("ewrr", err);
        console.log(err.response.data.message);
        reject(err.response.data.message);
      });
  });
};

const createSession = async (session: Session): Promise<Token> => {
  return new Promise((resolve, reject) => {
    api
      .post("/sessions", session)
      .then((response) => {
        if (response.status === 200) {
          apiHeader(response.data.token);
        }

        return resolve(response.data);
      })
      .catch((err) => {
        console.log("createSession", JSON.stringify(err));
        return reject(err);
      });
  });
};

const createRegistration = async (userId: string, form: RegistrationForm) => {
  return new Promise((resolve, reect) => {
    const registration = { userId } as Registration;
    api
      .post("/registrations", registration)
      .then((registrationId) => {
        console.log("CreateRegistration", registrationId);
        form.registrationId = registrationId.data;

        localStorage.setItem(
          LOCAL_STORAGE.registrationId,
          JSON.stringify(form.registrationId)
        );
        return api.post("/registrations/form", form);
      })
      .then((result) => console.log("CreateRegistrationForm", result))
      .then(resolve)
      .catch(reect);
  });
};

const createPayment = async (payment: RegistrationPayment, file: File) => {
  return new Promise((resolve, reject) => {
    console.log("createPayment", { payment, file });
    api
      .post("/registrations/payment", payment)
      .then((paymentId) => {
        console.log("PPQOQ", paymentId);
        const formData = new FormData();
        formData.append("receipt", file);

        return api.patch(`/registrations/payment/${paymentId.data}`, formData);
      })
      .then((result) => {
        console.log("SUCCESS", result);
        localStorage.clear();
      })
      .then(resolve)
      .then(reject);
  });
};

const getUserInfo = async (): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    api
      .get("/users/profile")
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

export {
  api,
  createRegistration,
  createUser,
  createPayment,
  createSession,
  getUserInfo,
};

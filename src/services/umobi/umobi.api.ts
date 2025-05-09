import { LOCAL_STORAGE } from "@/constants/Storage";
import { DashboardForm } from "@/model/views/DashboardForm";
import { EvaluatePayment } from "@/model/views/EvaluatePayment";
import axios, { AxiosResponse } from "axios";
import {
  Registration,
  RegistrationForm,
  RegistrationPayment,
  SummaryPayments,
} from "./models/Registration";
import { Reset } from "./models/Reset";
import { Session } from "./models/Session";
import { Token } from "./models/Token";
import { User } from "./models/User";
import { UserInfo } from "./models/UserInfo";
import { Camp } from "./models/Camp";

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
        return reject(err);
      });
  });
};

const createRegistration = async (userId: string, form: RegistrationForm) => {
  return new Promise((resolve, reject) => {
    const registration = { userId } as Registration;
    api
      .post("/registrations", registration)
      .then((registrationId) => {
        form.registrationId = registrationId.data;

        localStorage.setItem(
          LOCAL_STORAGE.registrationId,
          JSON.stringify(form.registrationId)
        );
        return api.post("/registrations/forms", form);
      })
      .then(resolve)
      .catch((err) => reject(err.response.data.message));
  });
};

const createPayment = async (payment: RegistrationPayment, file: File) => {
  return new Promise((resolve, reject) => {
    api
      .post("/registrations/payments", payment)
      .then((paymentId) => {
        const formData = new FormData();
        formData.append("receipt", file);

        return api.patch(`/registrations/payments/${paymentId.data}`, formData);
      })
      .then(resolve)
      .then(reject);
  });
};

const getForms = async (): Promise<DashboardForm[]> => {
  return new Promise((resolve, reject) => {
    api
      .get("/registrations/forms")
      .then((response) => resolve(response.data))
      .then(reject);
  });
};

const getForm = async (registrationId: string): Promise<RegistrationForm> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/registrations/forms/${registrationId}`)
      .then((response) => resolve(response.data))
      .then(reject);
  });
};

const getPayments = async (
  registrationId: string
): Promise<RegistrationPayment[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/registrations/payments/${registrationId}`)
      .then((response) => {
        const mapped = response.data.map((item: any) => {
          return {
            ...item,
            tax: Number.parseInt(item.tax),
          }
        })
        resolve(mapped)
      })
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

const getPendingPayments = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    api
      .get("/registrations/payments/pending")
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const evaluatePayment = async ({
  paymentId,
  rejected,
  reason,
  tax
}: EvaluatePayment): Promise<RegistrationPayment> => {
  return new Promise((resolve, reject) => {
    api
      .post(`/registrations/payments/${paymentId}`, { rejected, reason, tax })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const getSummary = async (): Promise<SummaryPayments> => {
  return new Promise((resolve, reject) => {
    api
      .get('/registrations/summary')
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

const sendCode = async (email: string): Promise<Reset> => {
  return new Promise((resolve, reject) => {
    api
      .post('/password/forgot', { email })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

const resetUser = async (token: string, password: string): Promise<Reset> => {
  return new Promise((resolve, reject) => {
    api
      .post(`password/reset?token=${token}`, { password })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

const removeReceipt = async (paymentId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/registrations/payments/${paymentId}`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

const getCurrentCamp = async (): Promise<Camp> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/camps/current`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

const getCamps = async (): Promise<Camp[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/camps`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
}

export {
  api,
  createRegistration,
  createUser,
  createPayment,
  createSession,
  getUserInfo,
  getPendingPayments,
  getForms,
  getPayments,
  getForm,
  evaluatePayment,
  getSummary,
  sendCode,
  resetUser,
  removeReceipt,
  getCurrentCamp,
  getCamps
};

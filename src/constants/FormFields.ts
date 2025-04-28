import { v4 as uuidV4 } from "uuid";

export interface IField {
  name: string;
  label: string;
  required?: boolean;
  subLabel?: string;
  mask?: string;
}

export interface IFieldItem {
  id: string;
  field: IField;
  type: "mail" | "text" | "date" | "radio" | "checkbox";
}

export const USER_FORM_FIELDS: IFieldItem[] = [
  {
    id: uuidV4(),
    field: {
      name: "email",
      label: "Qual o seu e-mail?",
      required: true,
    },
    type: "mail",
  },
  {
    id: uuidV4(),
    field: {
      name: "name",
      label: "Qual o seu nome completo?",
      required: true,
    },
    type: "text",
  },
  {
    id: uuidV4(),
    field: {
      name: "birthDate",
      label: "Qual sua data de nascimento?",
      required: true,
      mask: "99/99/9999",
    },
    type: "date",
  },
  {
    id: uuidV4(),
    field: {
      name: "address",
      label: "Qual seu endereço? (Rua, Nº, Bairro, Cidade)",
      required: true,
    },
    type: "text",
  },
  {
    id: uuidV4(),
    field: {
      name: "phoneNumber",
      label: "Qual o seu telefone para contato? (DDD  + Número)",
      required: true,
      mask: "(99) 99999-9999",
    },
    type: "text",
  },
  {
    id: uuidV4(),
    field: {
      name: "parentNames",
      label: "Qual o nome dos seus pais?",
      required: true,
    },
    type: "text",
  }
];

export const FORM_SIMPLE_FIELDS: IFieldItem[] = [
  {
    id: uuidV4(),
    field: {
      name: "churchName",
      label: "Em que igreja você congrega?",
    },
    type: "text",
  },
  {
    id: uuidV4(),
    field: {
      name: "ministerName",
      label: "Qual o nome do seu pastor?",
      required: true,
    },
    type: "text",
  },
  {
    id: uuidV4(),
    field: {
      name: "ministerNumber",
      label: "Qual o telefone do seu pastor?",
      required: true,
      mask: "(99) 99999-9999",
    },
    type: "text",
  },
];

export const FORM_COMPLEX_FIELDS = {
  ministerApproval: {
    id: uuidV4(),
    field: {
      name: "ministerApproval",
      label: "O seu pastor está ciente da sua inscrição?",
      subLabel: "Se a resposta for não, comunique ao seu pastor.",
    },
    type: "radio",
    options: [
      {
        label: "Sim",
        value: 1,
      },
      {
        label: "Não",
        value: 0,
      },
    ],
  },
  isAllergic: {
    id: uuidV4(),
    field: {
      name: "isAllergic",
      label: "Você tem alergia a algum medicamento?",
      subLabel: "Se a resposta for sim, informe no campo abaixo.",
    },
    type: "radio",
    options: [
      {
        label: "Sim",
        value: 1,
      },
      {
        label: "Não",
        value: 0,
      },
    ],
  },
  medicineName: {
    id: uuidV4(),
    field: { name: "medicineName", label: "Qual o medicamento?" },
    type: "text",
  },
  canSwim: {
    id: uuidV4(),
    field: {
      name: "canSwim",
      label: "Você sabe nadar?",
      subLabel:
        "Lembre-se de não se expor ao perigo e tomar preucações seguindo as orientações dadas pela diretoria do Retiro",
    },
    type: "radio",
    options: [
      {
        label: "Sim",
        value: 1,
      },
      {
        label: "Não",
        value: 0,
      },
    ],
  },
  isBeliever: {
    id: uuidV4(),
    field: { name: "isBeliever", label: "Você é crente em Jesus?" },
    type: "radio",
    options: [
      {
        label: "Sim",
        value: 1,
      },
      {
        label: "Não",
        value: 0,
      },
    ],
  },
  isResponsable: {
    id: uuidV4(),
    field: {
      name: "isResponsable",
      label:
        "Você se compromete em cumprir todas as regras que forem estabelecidas pela organização do acampamento?",
      required: true,
    },
    type: "radio",
    options: [
      {
        label: "Sim",
        value: 1,
      },
      {
        label: "Não",
        value: 0,
      },
    ],
  },
  moreInformation: {
    id: uuidV4(),
    field: {
      name: "moreInformation",
      label:
        "EXISTE ALGUMA INFORMAÇÃO SOBRE VOCÊ ONDE A NOSSA FALTA DE CONHECIMENTO POSSA COLOCAR SUA VIDA EM RISCO?",
    },
    type: "text",
  },
  isAllTrue: {
    id: uuidV4(),
    field: {
      name: "isAllTrue",
      label: "Preenchi conforme solicitado",
      required: true,
    },
    type: "checkbox",
  },
  password: {
    id: uuidV4(),
    field: {
      name: "password",
      label: "Crie uma senha(mínimo 6 caracteres)",
    },
    type: "password",
  },
  confirmPassword: {
    id: uuidV4(),
    field: {
      name: "confirmPassword",
      label: "Confirme sua senha",
    },
    type: "password",
  }
};

export const LOGIN_FIELDS = {
  email: {
    id: uuidV4(),
    field: {
      name: "email",
      label: "E-mail",
    },
    type: "email",
  },
  password: {
    id: uuidV4(),
    field: {
      name: "password",
      label: "Senha",
    },
    type: "password",
  },
  confirmPassword: {
    id: uuidV4(),
    field: {
      name: "confirmPassword",
      label: "Confirmar senha",
    },
    type: "password",
  },
};

export const RESET_FIELDS = {
  code: {
    id: uuidV4(),
    field: {
      name: "code",
      label: "Código",
    },
    type: "text",
  }
};

export const PAYMENT_FIELDS = {
  paymentMode: {
    id: uuidV4(),
    field: {
      name: "paymentMode",
      label: "Formas de Pagamento",
      subLabel: "No caso do parcelamento, o valor da entrada é R$ 50,00 via PIX para que sua vaga seja garantida.",
    },
    type: "radio",
    options: [
      {
        label: "PIX - À vista",
        value: "pix",
      },
      {
        label: "Parcelado - (Entrada + 1x de R$ 130,00)",
        value: "1x",
      }
    ],
    lastOptions: [
      {
        label: "PIX - 1x de R$ 180,00",
        value: "1x",
      },
    ]
  },
  tax: {
    id: uuidV4(),
    field: {
      name: "tax",
      label: "Qual o valor do comprovante?",
      required: true,
    },
    type: "number",
  },
};

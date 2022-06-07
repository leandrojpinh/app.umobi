export interface IField {
  name: string;
  label: string;
  required?: boolean;
  subLabel?: string;
}

export interface IFieldItem {
  id: number;
  field: IField;
  type: "mail" | "text" | "date" | "radio" | "checkbox";
}
export const FORM_SIMPLE_FIELDS: IFieldItem[] = [
  {
    id: 1,
    field: {
      name: "email",
      label: "Qual o seu e-mail?",
      required: true,
    },
    type: "mail",
  },
  {
    id: 4,
    field: {
      name: "name",
      label: "Qual o seu nome completo?",
      required: true,
    },
    type: "text",
  },
  {
    id: 5,
    field: {
      name: "birthDate",
      label: "Qual sua data de nascimento?",
      required: true,
    },
    type: "date",
  },
  {
    id: 6,
    field: {
      name: "address",
      label: "Qual seu endereço? (Rua, Nº, Bairro, Cidade)",
      required: true,
    },
    type: "text",
  },
  {
    id: 7,
    field: {
      name: "phoneNumber",
      label: "Qual o seu telefone para contato? (DDD  + Número)",
      required: true,
    },
    type: "text",
  },
  {
    id: 8,
    field: {
      name: "parentNames",
      label: "Qual o nome dos seus pais?",
      required: true,
    },
    type: "text",
  },
  {
    id: 9,
    field: { name: "churchName", label: "Em que igreja você congrega?" },
    type: "text",
  },
  {
    id: 10,
    field: {
      name: "ministerNumber",
      label: "Qual o telefone do seu pastor?",
      required: true,
    },
    type: "text",
  },
];

export const FORM_COMPLEX_FIELDS = {
  ministerApproval: {
    id: 10,
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
    id: 12,
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
    id: 13,
    field: { name: "medicineName", label: "Qual o medicamento?" },
    type: "text",
  },
  canSwim: {
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
    field: {
      name: "moreInformation",
      label:
        "EXISTE ALGUMA INFORMAÇÃO SOBRE VOCÊ ONDE A NOSSA FALTA DE CONHECIMENTO POSSA COLOCAR SUA VIDA EM RISCO?",
    },
    type: "text",
  },
  isAllTrue: {
    id: 18,
    field: { name: "isAllTrue", label: "Preenchi conforme solicitado", required: true, },
    type: "checkbox",
  },
};

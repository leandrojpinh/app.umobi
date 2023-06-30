import { useRouter } from "next/router";
import { FormEvent, useState, useEffect, InputHTMLAttributes, useMemo } from "react";

import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { Layout } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";
import { Topic } from "@/components/common/Topic";
import { FORM, FormRole } from "@/constants/FormRules";
import { LOCAL_STORAGE } from "@/constants/Storage";

import { registrationModule as styles } from '@/styles/components/pages';
import Image from "next/image";
import Input from "@/components/common/Input";
import { Radio } from "@/components/common/Radio";
import { FORM_COMPLEX_FIELDS, FORM_SIMPLE_FIELDS, PAYMENT_FIELDS } from "@/constants/FormFields";
import { useAuth } from "@/context/AuthContainer";
import { useApp } from "@/context/AppContext";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";
import { createPayment, createRegistration, getCurrentCamp } from "@/services/umobi/umobi.api";
import { toast } from "react-toastify";
import { ERRORS } from "@/constants/ErrorMessages";
import { useEmail } from "@/context/EmailProvider";
import { IResponseProps, Response } from "@/components/common/Response";
import { CampDetails } from "@/components/common/CampDetails";
import { FileContainer } from "@/styles/pages/Payments";
import { FiPaperclip } from "react-icons/fi";
import { Camp } from "@/services/umobi/models/Camp";
import { PaymentForm } from "@/components/pages/paymentForm";

interface RoleProps {
  name: string;
  items: FormRole[];
}

type IRegistrationProps = {
  churchName: string;
  ministerApproval: boolean;
  ministerName: string;
  ministerNumber: string;
  isAllergic: boolean;
  medicineName: string;
  canSwim: boolean;
  isBeliever: boolean;
  isResponsable: boolean;
  moreInformation: string;
  isAllTrue: boolean;
}

export type IPaymentProps = {
  registrationId: string;
  tax: number;
  paymentMode: string;
}

const Role = ({ items, name }: RoleProps) => {
  let rows: string[] = [];
  items.forEach(item => {
    rows.push(item.description);

    if (item.options && item.options.length > 0) {
      rows = rows.concat(item.options);
    }
  });

  return (
    <div className={styles.role}>
      <strong>{name}</strong>
      {rows.map((row, index) => (
        <span key={index}>{row}</span>
      ))}
    </div>
  )
}

const INITIAL_STATE: IRegistrationProps = {
  canSwim: false,
  churchName: '',
  isAllTrue: false,
  isAllergic: false,
  isBeliever: false,
  isResponsable: false,
  medicineName: '',
  ministerApproval: false,
  ministerName: '',
  ministerNumber: '',
  moreInformation: '',
};

const INITIAL_STATE_PAYMENT: RegistrationPayment = {
  paymentMode: 'pix',
  registrationId: '',
  tax: 200
};


export default function Registration() {
  const app = useApp();
  const auth = useAuth();
  const history = useRouter();
  const email = useEmail();

  const [events, setEvents] = useState<Camp[]>();
  const [selectedEvent, setSelectedEvent] = useState<Camp>();
  const [registration, setRegistration] = useState<IRegistrationProps>(INITIAL_STATE);
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(0);

  const [file, setFile] = useState<File>();
  const [tax, setTax] = useState(200);
  const [paymentMode, setPaymentMode] = useState('pix');
  const [payment, setPayment] = useState<RegistrationPayment>(INITIAL_STATE_PAYMENT);
  const [response, setResponse] = useState<IResponseProps>();

  useEffect(() => {
    console.log("USER", auth.user);
    if (!auth.user.isAuthenticated) {
      history.push('sign-in')

    }

    app.setIsLoading(true);
    getCurrentCamp().then(camp => {
      setEvents([camp]);
    })
      .catch(err => {
        console.log('ERROR-137', err);

        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const value = payment.paymentMode === 'pix' ? 200 : payment.paymentMode === '2x' ? 100 : parseFloat((200 / 3).toFixed(2));
    changePaymentField(PAYMENT_FIELDS.tax.field.name, value);
  }, [payment.paymentMode])

  const changeField = (field: string, value: any) => {
    const newRegistration = {
      ...registration,
      [field]: value
    } as IRegistrationProps;
    setRegistration(newRegistration);
  }

  const changePaymentField = (field: string, value: any) => {
    setPayment({ ...payment, [`${field}`]: value });
  }

  const isStep1Valid = () => {
    const requiredSimpleFields = FORM_SIMPLE_FIELDS.filter(f => f.field.required);

    const fieldsWithValue = requiredSimpleFields.reduce((total, field) => {
      total += registration?.[field.field.name as keyof IRegistrationProps] ? 1 : 0;

      return total;
    }, 0);

    const isResponsableCheck = registration?.[FORM_COMPLEX_FIELDS.isResponsable.field.name as keyof IRegistrationProps];
    const isAllTrue = registration?.[FORM_COMPLEX_FIELDS.isAllTrue.field.name as keyof IRegistrationProps];

    return fieldsWithValue === requiredSimpleFields.length && isResponsableCheck && isAllTrue;
  }

  const handleFile = (fileSelected?: any) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }

  const handleStep0 = async (e: FormEvent) => {
    e.preventDefault();

    setStep(step + 1);
    setEvents(events?.filter(f => f.name === selectedEvent?.name));
  }

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    //VALIDAR A PRESENÇA DO USER ID

    const form = {
      campId: selectedEvent?.id,
      canSwim: registration.canSwim,
      churchName: registration.churchName,
      isAllergic: registration.isAllergic,
      isAllTrue: registration.isAllTrue,
      isBeliever: registration.isBeliever,
      isResponsable: registration.isResponsable,
      medicineName: registration.medicineName,
      ministerApproval: registration.ministerApproval,
      ministerName: registration.ministerName,
      ministerNumber: registration.ministerNumber,
      moreInformation: registration.moreInformation,
    } as RegistrationForm;

    createRegistration(auth?.user?.id, form).then(_ => {
      toast.success('Sua inscrição foi enviada, vamos para o próximo passo!');

      app.setIsLoading(false);
      setStep(step + 1);
    })
      .catch(err => {
        console.log('ERROR-137', err);
        app.setIsLoading(false);

        if (err === ERRORS.formAlreadyExists.error) {
          toast.info(ERRORS.formAlreadyExists.message);
          setStep(step + 1);
          return;
        }

        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        const registrationId = localStorage.getItem(LOCAL_STORAGE.registrationId) || '';
        changePaymentField('registrationId', JSON.parse(registrationId));

        app.setIsLoading(false);
      });
  }

  const handleStep2 = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    createPayment(payment, file as File)
      .then(_ => {
        if (auth.user.isAuthenticated) {
          // email.sendRegistration({
          //   email: auth.user.email,
          //   name: auth.user.name,
          //   data: new Date().toLocaleString()
          // }).then(_ => {
          setStep(step + 1);
          setResponse({
            title: 'tudo certo!',
            message: 'Sua inscrição foi enviada. Assim que for confirmada você receberá um e-mail avisando que foi aprovado, ou se precisa fazer algum ajuste no comprovante. Até lá!',
            type: 'success'
          });
          // }).catch(err => console.log(err));
        }
      })
      .catch(err => console.log('ERRR', err))
      .finally(() => {
        app.setIsLoading(false);
      });
  }

  return (
    <Layout>
      <Title title="Inscrição" subtitle={`Passo ${step + 1}/3`} />
      <>
        {step === 0 ? (
          <>
            <section className={styles.events}>
              <Topic title="Eventos" />
              <ul>
                {events?.map((evt, index) => (
                  <li key={index} onClick={() => setSelectedEvent(evt)} className={evt.name === selectedEvent?.name ? styles.selected : ''}>
                    <Image src={'/empty-folder.png'} alt={evt.name} width={120} height={140} />
                  </li>
                ))}
              </ul>
              <span>{`${selectedEvent !== undefined ? selectedEvent.name : 'Selecione o evento'}`}</span>
            </section>
            {selectedEvent && <section>
              <Topic title="Regras" />

              {FORM.map(({ id, name, items }) => <Role key={id} name={name} items={items} />)}

              <form onSubmit={handleStep0}>
                <Checkbox label="Li e concordo" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />

                <Button type={'submit'} label="Continuar" disabled={!isChecked} />
              </form>
            </section>
            }
          </>
        ) : step === 1 ? (
          <section>
            <Topic title="Formulário" />

            <form onSubmit={handleStep1}>
              {FORM_SIMPLE_FIELDS.map(({ field, id, type }) => {
                const value = registration?.[field.name as keyof IRegistrationProps];
                return (
                  <Input
                    type={type}
                    key={id}
                    mask={field.mask}
                    label={field.label}
                    name={field.name}
                    required={field.required}
                    onChange={e => changeField(field.name, e.target.value)}
                    value={value as keyof InputHTMLAttributes<HTMLInputElement>}
                  />
                )
              }
              )}

              <Radio
                key={FORM_COMPLEX_FIELDS.ministerApproval.id}
                label={FORM_COMPLEX_FIELDS.ministerApproval.field.label}
                options={FORM_COMPLEX_FIELDS.ministerApproval.options}
                name={FORM_COMPLEX_FIELDS.ministerApproval.field.name}
                subLabel={FORM_COMPLEX_FIELDS.ministerApproval.field.subLabel}
                selected={registration.ministerApproval ? 1 : 0}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.ministerApproval.field.name, e.target.value === '1')}
              />

              <Radio
                key={FORM_COMPLEX_FIELDS.isAllergic.id}
                label={FORM_COMPLEX_FIELDS.isAllergic.field.label}
                options={FORM_COMPLEX_FIELDS.isAllergic.options}
                name={FORM_COMPLEX_FIELDS.isAllergic.field.name}
                subLabel={FORM_COMPLEX_FIELDS.isAllergic.field.subLabel}
                selected={registration.isAllergic ? 1 : 0}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.isAllergic.field.name, e.target.value === '1')}
              />

              {
                registration?.isAllergic && (
                  <Input
                    key={FORM_COMPLEX_FIELDS.medicineName.id}
                    label={FORM_COMPLEX_FIELDS.medicineName.field.label}
                    name={FORM_COMPLEX_FIELDS.medicineName.field.name}
                    value={registration?.medicineName}
                    onChange={e => changeField(FORM_COMPLEX_FIELDS.medicineName.field.name, e.target.value)}
                  />
                )
              }

              <Radio
                key={FORM_COMPLEX_FIELDS.canSwim.id}
                label={FORM_COMPLEX_FIELDS.canSwim.field.label}
                options={FORM_COMPLEX_FIELDS.canSwim.options}
                name={FORM_COMPLEX_FIELDS.canSwim.field.name}
                subLabel={FORM_COMPLEX_FIELDS.canSwim.field.subLabel}
                selected={registration.canSwim ? 1 : 0}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.canSwim.field.name, e.target.value === '1')}
              />

              <Radio
                key={FORM_COMPLEX_FIELDS.isBeliever.id}
                label={FORM_COMPLEX_FIELDS.isBeliever.field.label}
                options={FORM_COMPLEX_FIELDS.isBeliever.options}
                name={FORM_COMPLEX_FIELDS.isBeliever.field.name}
                selected={registration.isBeliever ? 1 : 0}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.isBeliever.field.name, e.target.value === '1')}
              />

              <Radio
                key={FORM_COMPLEX_FIELDS.isResponsable.id}
                label={FORM_COMPLEX_FIELDS.isResponsable.field.label}
                options={FORM_COMPLEX_FIELDS.isResponsable.options}
                name={FORM_COMPLEX_FIELDS.isResponsable.field.name}
                required={FORM_COMPLEX_FIELDS.isResponsable.field.required}
                selected={registration.isResponsable ? 1 : 0}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.isResponsable.field.name, e.target.value === '1')}
              />

              <Input
                key={FORM_COMPLEX_FIELDS.moreInformation.id}
                label={FORM_COMPLEX_FIELDS.moreInformation.field.label}
                name={FORM_COMPLEX_FIELDS.moreInformation.field.name}
                value={registration?.moreInformation}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.moreInformation.field.name, e.target.value)}
              />

              <Checkbox
                key={FORM_COMPLEX_FIELDS.isAllTrue.id}
                label={FORM_COMPLEX_FIELDS.isAllTrue.field.label}
                required={FORM_COMPLEX_FIELDS.isAllTrue.field.required}
                checked={registration.isAllTrue}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.isAllTrue.field.name, e.target.checked)}
              />

              <Button type={'submit'} label="Continuar" disabled={!isStep1Valid()} />
            </form>
          </section>
        ) : step === 2 ? (
          <section>
            <Topic title="Comprovante de Pagamento" />

            <CampDetails />

            <PaymentForm
              file={file}
              onFileChange={handleFile}
              submit={handleStep2}
              onPaymentChange={changePaymentField}
              payment={payment}
            />
          </section>
        ) : (
          <>
            {response && <Response type={response.type} message={response.message} title={response.title} />}
          </>
        )}
      </>
    </Layout>
  )
}
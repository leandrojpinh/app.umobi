'use client';

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, InputHTMLAttributes } from "react";
import { animateScroll as scroll } from "react-scroll";

import Image from "next/image";
import { FORM_COMPLEX_FIELDS, FORM_SIMPLE_FIELDS, PAYMENT_FIELDS } from "@/constants/FormFields";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";
import { createPayment, createRegistration, getCamps } from "@/services/umobi/umobi.api";
import { toast } from "react-toastify";
import { ERRORS } from "@/constants/ErrorMessages";
import { Camp } from "@/services/umobi/models/Camp";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { FORM, FormRole } from "@/constants/FormRules";
import { IResponseProps, Response } from "@/components/ui/Response";
import { LOCAL_STORAGE } from "@/constants/Storage";
import { Loader } from "@/components/ui/Loader";
import { Layout } from "@/components/ui/Layout";
import { Title, Topic } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { CampDetails } from "@/components/ui/CampDetails";
import { PaymentForm } from "@/components/pages/PaymentForms";
import { useEmail } from "@/contexts/EmailProvider";
import { SendReceipt, SendRegistration } from "@/services/email/email";

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
    <div className={'flex flex-col w-full mb-4'}>
      <strong className="uppercase font-medium text-lg pb-2 tracking-widest">{name}</strong>
      {rows.map((row, index) => (
        <span className="font-normal pb-2 font-app-text" key={index}>{row}</span>
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
  tax: 180
};


export default function Registration() {
  const app = useApp();
  const auth = useAuth();
  const history = useRouter();
  const email = useEmail();

  const [selectedEvent, setSelectedEvent] = useState<Camp>();
  const [registration, setRegistration] = useState<IRegistrationProps>(INITIAL_STATE);
  const [isChecked, setIsChecked] = useState(false);
  const [step, setStep] = useState(0);

  const [file, setFile] = useState<File>();
  const [payment, setPayment] = useState<RegistrationPayment>(INITIAL_STATE_PAYMENT);
  const [response, setResponse] = useState<IResponseProps>();

  useEffect(() => {
    if (!auth.user.isAuthenticated) {
      history.push('/sign-in');
    }

    getCamps().then(camps => {
      app.setEvents(camps);
    })
      .catch(err => {
        console.log('ERROR-137', err);

        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const value = payment.paymentMode === 'pix' ? 180 : 50;
    changePaymentField(PAYMENT_FIELDS.tax.field.name, value);
  }, [payment.paymentMode]);

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
    scroll.scrollToTop();
  }

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    if (auth.user.id === '' || auth.user.id === undefined) {
      history.push('sign-in');
    }

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

    createRegistration(auth.user.id, form).then(_ => {
      toast.success('Sua inscrição foi enviada, vamos para o próximo passo!');
      if (auth.user.isAuthenticated) {
        SendRegistration({
          email: auth.user.email,
          name: auth.user.name,
          eventName: selectedEvent?.name
        });
      }

      app.setIsLoading(false);
      setStep(step + 1);
      scroll.scrollToTop();
    })
      .catch(err => {
        console.log('ERROR-137', err);
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

  const handleStep2 = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warn('Selecionar um arquivo');
      return;
    }

    if (payment.paymentMode !== 'pix' && payment.tax < 50) {
      toast.warn('O valor mínimo da entrada é de R$ 50,00');
      return;
    }

    app.setIsLoading(true);

    try {
      await createPayment(payment, file as File);
      if (auth.user.isAuthenticated) {
        const mail = await SendReceipt({
          email: auth.user.email,
          name: auth.user.name,
          eventName: selectedEvent?.name
        });

        if (mail.data?.id) {
          setStep(step + 1);
          setResponse({
            title: 'tudo certo!',
            message: 'Suas informações foram enviadas. Assim que forem confirmadas você receberá um e-mail avisando que foi aprovado, ou se precisa fazer algum ajuste no comprovante. Até lá!',
            type: 'success'
          });
        }
      }
    } catch (err) {
      console.log(err);
      toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
    } finally {
      app.setIsLoading(false);
    }
  }

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> : (
        <>
          {app.hasAvailableEvents ? (
            <Layout title="Inscrição" hasBackdrop>
              {(step + 1) <= 3 && (
                <>
                  <Title title="Inscrição" subtitle={`Passo ${step + 1}/3`} />
                </>
              )}

              <>
                {step === 0 ? (
                  <>
                    <section className={'flex flex-col pt-0 pr-0 pb-8'}>
                      <Topic title="Eventos" />
                      <ul className="gap-4 rounded-md flex w-fit">
                        {app.events?.map(evt => (
                          <li key={evt.id} onClick={() => setSelectedEvent(evt)} className={`flex flex-1 h-full cursor-pointer transition-all duration-200 rounded-md border-solid border-2 hover:brightness-90 ${evt.name === selectedEvent?.name ? 'border-app-primary-light' : 'border-[transparent]'}`}>
                            <Image className="rounded-lg h-full" src={!!evt.folderUrl ? evt.folderUrl : '/folder.svg'} alt={evt.name} width={120} height={140} />
                          </li>
                        ))}
                      </ul>
                      <span className="mt-4 text-lg tracking-widest">{`${selectedEvent !== undefined ? selectedEvent.name : 'Selecione o evento'}`}</span>
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
                      key={'registration-payment'}
                      file={file}
                      onFileChange={handleFile}
                      submit={handleStep2}
                      onPaymentChange={changePaymentField}
                      payment={payment}
                      payments={[]}
                    />
                  </section>
                ) : (
                  <>
                    {response && <Response type={response.type} message={response.message} title={response.title} />}
                  </>
                )}
              </>
            </Layout>
          ) : (
            <Layout title="Inscrição">
              <Response type={'error'} message={'Não há mais eventos disponíveis.'} title={''} />
            </Layout>
          )}
        </>
      )}
    </>
  )
}
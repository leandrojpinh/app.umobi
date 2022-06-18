import { FormEvent, InputHTMLAttributes, useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { toast } from 'react-toastify';

import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import { Layout } from "@/components/common/Layout"
import { Radio } from "@/components/common/Radio";
import { Title } from "@/components/common/Title"
import { Topic } from "@/components/common/Topic"
import { FORM_SIMPLE_FIELDS, FORM_COMPLEX_FIELDS } from "@/constants/FormFields";
import { LOCAL_STORAGE } from "@/constants/Storage";
import { useApp } from "@/context/AppContext";
import { Loader } from "@/components/common/Loader";

import styles from '@/styles/pages/form-registration.module.scss';

import { createRegistration, createUser } from "@/services/umobi/umobi.api";
import { RegistrationForm } from '@/services/umobi/models/Registration';
import { User } from '@/services/umobi/models/User';

export type IRegistrationProps = {
  email: string;
  name: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  parentNames: string;
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
  password: string;
}

export default function Registration() {
  const INITIAL_STATE: IRegistrationProps = {
    address: "",
    birthDate: moment().format('yyyy/MM/dd'),
    canSwim: false,
    churchName: '',
    email: '',
    isAllTrue: false,
    isAllergic: false,
    isBeliever: false,
    isResponsable: false,
    medicineName: '',
    ministerApproval: false,
    ministerName: '',
    ministerNumber: '',
    moreInformation: '',
    name: '',
    parentNames: '',
    phoneNumber: '',
    password: '',
  };

  const history = useRouter();
  const app = useApp();
  const [registration, setRegistration] = useState<IRegistrationProps>(INITIAL_STATE);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const hasAgreed = localStorage.getItem(LOCAL_STORAGE.agree);
    if (hasAgreed !== '1') {
      toast.dark('Hmm, parece que ainda não marcou sobre concordar com a regras...');

      // eslint-disable-next-line react-hooks/exhaustive-deps
      history.back();
    }

    const hasStarted = localStorage.getItem(LOCAL_STORAGE.form);
    if (hasStarted) {
      setRegistration(JSON.parse(hasStarted) as IRegistrationProps);
      toast.dark('Parece que tem um cadastro ainda não finalizado, preenchi os campos que já estavam preenchidos antes. :)');
    }
  }, [history]);

  const changeField = (field: string, value: any) => {
    const newRegistration = {
      ...registration,
      [field]: value
    } as IRegistrationProps;
    setRegistration(newRegistration);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    if (moment.duration(moment().diff(moment(registration.birthDate))).years() < 14) {
      toast.warn('Hmm, você ainda não tem idade para participar...');

      setTimeout(() => {
        app.setIsLoading(false);
        history.push('/');
      }, 3000);
      return;
    }

    localStorage.setItem(LOCAL_STORAGE.form, JSON.stringify(registration));

    const user = {
      address: registration.address,
      birthDate: registration.birthDate,
      email: registration.email.toLowerCase().trim(),
      name: registration.name,
      parentNames: registration.parentNames,
      phoneNumber: registration.phoneNumber,
      password: registration.password
    } as User;
    createUser(user)
      .then((userId) => {
        toast.success('Seu usuário foi criado!');
        const form = {
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

        return createRegistration(userId as string, form);
      })
      .then(_ => {
        toast.success('Sua inscrição foi enviada, vamos para o próximo passo!');

        history.push('/registration/payment');
      })
      .catch(err => {
        console.log('ERROR-137', err);
        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);
      });
  }

  const isValid = () => {
    const requiredSimpleFields = FORM_SIMPLE_FIELDS.filter(f => f.field.required);

    const fieldsWithValue = requiredSimpleFields.reduce((total, field) => {
      total += registration?.[field.field.name as keyof IRegistrationProps] ? 1 : 0;

      return total;
    }, 0);

    const isResponsableCheck = registration?.[FORM_COMPLEX_FIELDS.isResponsable.field.name as keyof IRegistrationProps];
    const isAllTrue = registration?.[FORM_COMPLEX_FIELDS.isAllTrue.field.name as keyof IRegistrationProps];
    const validPassword = registration?.password && registration?.password === confirmPassword && registration?.password.length >= 6;

    return fieldsWithValue === requiredSimpleFields.length && isResponsableCheck && isAllTrue && validPassword;
  }

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        <Layout>
          <Title
            title="Inscrição"
            subtitle="*Obs: idade mínima para participar é de 14 anos" />

          <Topic title="Registro" />
          <span className={styles.register}>Os dados informados serão utilizados para criar seu usuário na plataforma para que você possa acompanhar a sua inscrição.</span>

          <section>
            <Topic title="Formulário" />

            <form onSubmit={handleSubmit}>
              {FORM_SIMPLE_FIELDS.map(({ field, id, type }) => {
                if (type === 'date') {
                  return (
                    <Input
                      placeholder="DD/MM/YYYY"
                      type={type}
                      key={id}
                      label={field.label}
                      name={field.name}
                      required={field.required}
                      value={registration['birthDate']}
                      onChange={e => changeField(field.name, e.target.value)} />
                  )
                }

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

              <Input
                key={FORM_COMPLEX_FIELDS.password.id}
                label={FORM_COMPLEX_FIELDS.password.field.label}
                name={FORM_COMPLEX_FIELDS.password.field.name}
                value={registration?.password}
                type={FORM_COMPLEX_FIELDS.password.type}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.password.field.name, e.target.value)}
              />

              <Input
                key={FORM_COMPLEX_FIELDS.confirmPassword.id}
                label={FORM_COMPLEX_FIELDS.confirmPassword.field.label}
                name={FORM_COMPLEX_FIELDS.confirmPassword.field.name}
                value={confirmPassword}
                type={FORM_COMPLEX_FIELDS.password.type}
                onChange={e => setConfirmPassword(e.target.value)}
              />

              <Checkbox
                key={FORM_COMPLEX_FIELDS.isAllTrue.id}
                label={FORM_COMPLEX_FIELDS.isAllTrue.field.label}
                required={FORM_COMPLEX_FIELDS.isAllTrue.field.required}
                checked={registration.isAllTrue}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.isAllTrue.field.name, e.target.checked)}
              />

              <Button type={'submit'} label="Continuar" disabled={!isValid()} />
            </form>
          </section>
        </Layout>
      }
    </>
  )
}
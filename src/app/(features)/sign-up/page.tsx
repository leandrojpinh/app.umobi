'use client'

import { FormEvent, InputHTMLAttributes, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import { toast } from 'react-toastify';

import { FORM_COMPLEX_FIELDS, USER_FORM_FIELDS } from "@/constants/FormFields";

import { createUser } from "@/services/umobi/umobi.api";
import { User } from '@/services/umobi/models/User';
import { ERRORS } from "@/constants/ErrorMessages";
import { useApp } from "@/contexts/AppContext";
import { Loader } from "@/components/ui/Loader";
import { Layout } from "@/components/ui/Layout";
import { Title, Topic } from "@/components/ui/Text";
import { Input, Password } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type IRegistrationProps = {
  email: string;
  name: string;
  birthDate: string;
  address: string;
  phoneNumber: string;
  parentNames: string;
  password: string;
}

export default function SignUp() {
  const INITIAL_STATE: IRegistrationProps = {
    address: "",
    birthDate: moment().utc().format('yyyy/MM/DD'),
    email: '',
    name: '',
    parentNames: '',
    phoneNumber: '',
    password: '',
  };

  const history = useRouter();
  const app = useApp();

  const [registration, setRegistration] = useState<IRegistrationProps>(INITIAL_STATE);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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
      .then(_ => {
        toast.success('Conta criada com sucesso! Faça o login para realizar sua inscrição.');

        app.setIsLoading(false);
      })
      .catch(err => {
        console.log('ERROR-137', err);
        app.setIsLoading(false);

        if (err === ERRORS.userAlreadyExists.error) {
          toast.error(ERRORS.userAlreadyExists.message);
          return;
        }

        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);

        history.push('/sign-in');
      });
  }

  const isValid = () => {
    const fieldsWithValue = USER_FORM_FIELDS.reduce((total, field) => {
      total += registration?.[field.field.name as keyof IRegistrationProps] ? 1 : 0;

      return total;
    }, 0);

    const validPassword = registration?.password && registration?.password === confirmPassword && registration?.password.length >= 6;

    return fieldsWithValue === USER_FORM_FIELDS.length && validPassword;
  }

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        <Layout title="Cadastro" hasBackdrop>
          <Title title="Criar conta" />

          <Topic title="Registro" />
          <span className={'font-app-text flex flex-col rounded-md p-4 mb-8 shadow-md bg-app-black-light'}>Os dados informados serão utilizados para criar seu usuário na plataforma para que você possa acompanhar a sua inscrição.</span>

          <section>
            <Topic title="Cadastro" />

            <form onSubmit={handleSubmit}>
              {USER_FORM_FIELDS.map(({ field, id, type }) => {
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

              <Password
                key={FORM_COMPLEX_FIELDS.password.id}
                label={FORM_COMPLEX_FIELDS.password.field.label}
                name={FORM_COMPLEX_FIELDS.password.field.name}
                type={isPasswordVisible ? 'text' : FORM_COMPLEX_FIELDS.password.type}
                onChange={e => changeField(FORM_COMPLEX_FIELDS.password.field.name, e.target.value)}
                setIsVisible={() => setIsPasswordVisible(!isPasswordVisible)}
                isVisible={isPasswordVisible}
              />

              <Password
                key={FORM_COMPLEX_FIELDS.confirmPassword.id}
                label={FORM_COMPLEX_FIELDS.confirmPassword.field.label}
                name={FORM_COMPLEX_FIELDS.confirmPassword.field.name}
                type={isConfirmPasswordVisible ? 'text' : FORM_COMPLEX_FIELDS.password.type}
                onChange={e => setConfirmPassword(e.target.value)}
                setIsVisible={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                isVisible={isConfirmPasswordVisible}
              />

              <Button type={'submit'} label="Criar conta" disabled={!isValid()} />
            </form>
          </section>
        </Layout>
      }
    </>
  )
}
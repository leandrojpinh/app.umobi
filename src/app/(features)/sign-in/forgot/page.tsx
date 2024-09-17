'use client';

import { FormEvent, useState } from "react";



import { LOGIN_FIELDS, RESET_FIELDS } from "@/constants/FormFields";

import { resetUser, sendCode } from "@/services/umobi/umobi.api";

import { toast } from "react-toastify";
import { Back, SignInButton } from "@/components/ui/Button";
import { Title } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Layout } from "@/components/ui/Layout";
import { Loader } from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { SendCode } from "@/services/email/email";

// import { SendCode } from "@/services/email/email";

type Stage = 'email' | 'code';

export default function Forgot() {
  const history = useRouter();
  const auth = useAuth();
  const app = useApp();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState<Stage>('email');

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);

    try {
      const response = await sendCode(email);
      const mail = await SendCode({
        code: response.code,
        email: response.email,
        name: response.name
      });

      if (mail.data?.id) {
        toast.success('Enviamos um código de confirmação para seu e-mail, verifica se chegou no seu e-mail');
        setStage('code');
      }
    } catch (err) {
      console.log(err);
      toast.warn('Não identicamos seu e-mail ou deu algum problema na comunicação, verifique com a Secretaria.');
    } finally {
      app.setIsLoading(false);
    }
  }

  const handleCode = async (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error('As senhas estão diferentes.');
      app.setIsLoading(false);
      return;
    }

    resetUser(code, password).then((_) => {
      toast.success('Senha alterada com sucesso! Você já pode utilizar a nova senha para fazer Login.');

      history.push('/sign-in');
    }).catch(err => {
      toast.success('Não identicamos seu e-mail ou deu algum problema na comunicação, verifique com a Secretaria.');
      console.log('signError', err);
    }).finally(() => {
      app.setIsLoading(false);
    });
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={app.isLoading || auth.loading} /> :
        (
          <Layout title="Recuperação de conta">
            {stage === 'email' ? (
              <section className={'flex flex-col max-w-md my-0 mx-auto'}>
                <Back />
                <Title
                  title="Reset de senha"
                  subtitle="Para resetar a senha, informe o seu e-mail." />

                <form onSubmit={handleEmail}>
                  <Input
                    key={LOGIN_FIELDS.email.id}
                    label={LOGIN_FIELDS.email.field.label}
                    name={LOGIN_FIELDS.email.field.name}
                    value={email}
                    type={LOGIN_FIELDS.email.type}
                    onChange={e => setEmail(e.target.value)}
                  />

                  <SignInButton label="Enviar código" disabled={!email} />
                </form>
              </section>
            ) : (
              <section className={'flex flex-col max-w-md my-0 mx-auto'}>
                <Back />
                <Title title="Código" />

                <form onSubmit={handleCode}>
                  <Input
                    key={RESET_FIELDS.code.id}
                    label={RESET_FIELDS.code.field.label}
                    name={RESET_FIELDS.code.field.name}
                    type={RESET_FIELDS.code.type}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                  />

                  <Input
                    key={LOGIN_FIELDS.password.id}
                    label={LOGIN_FIELDS.password.field.label}
                    name={LOGIN_FIELDS.password.field.name}
                    type={LOGIN_FIELDS.password.type}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Input
                    key={LOGIN_FIELDS.confirmPassword.id}
                    label={LOGIN_FIELDS.confirmPassword.field.label}
                    name={LOGIN_FIELDS.confirmPassword.field.name}
                    type={LOGIN_FIELDS.confirmPassword.type}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />

                  <SignInButton label="Valida e Enviar" disabled={!password || !confirmPassword || !code || (password.length < 6)} />
                </form>
              </section>
            )}
          </Layout>
        )
      }
    </>
  )
}
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import { useApp } from "@/context/AppContext";

import { SignInButton } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import Input from "@/components/common/Input";

import { SIGN_IN_FIELDS, RESET_FIELDS } from "@/constants/FormFields";

import { signInModule as styles } from '@/styles/pages';
import { useAuth } from "@/context/AuthContainer";
import { resetUser, sendCode } from "@/services/umobi/umobi.api";
import { useEmail } from "@/context/EmailProvider";
import { toast } from "react-toastify";
import { Back } from "@/components/common/Back";

type Stage = 'email' | 'code';

export default function Forgot() {
  const history = useRouter();
  const auth = useAuth();
  const app = useApp();
  const mail = useEmail();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState<Stage>('email');

  const handleEmail = (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);

    sendCode(email).then((response) => {
      mail.sendReset({
        email: response.email,
        name: response.name,
        code: response.code
      })
        .then(_ => {
          toast.success('Enviamos um código de confirmação para seu e-mail, verifica se chegou no seu e-mail');

          setStage('code');
        })
        .catch(err => console.log(err))
        .finally(() => app.setIsLoading(false));
    }).catch(err => {
      toast.warn('Não identicamos seu e-mail ou deu algum problema na comunicação, verifique com a Secretaria.');
      console.log('signError', err);
      app.setIsLoading(false);
    });
  }

  const handleCode = (e: FormEvent) => {
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
      app.setIsLoading(false);
    });
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={app.isLoading || auth.loading} /> :
        (
          <Layout>
            {stage === 'email' ? (
              <section className={styles.container}>
                <Back />
                <Title
                  title="Reset de senha"
                  subtitle="Para resetar a senha, informe o seu e-mail." />

                <form onSubmit={handleEmail}>
                  <Input
                    key={SIGN_IN_FIELDS.email.id}
                    label={SIGN_IN_FIELDS.email.field.label}
                    name={SIGN_IN_FIELDS.email.field.name}
                    value={email}
                    type={SIGN_IN_FIELDS.email.type}
                    onChange={e => setEmail(e.target.value)}
                  />

                  <SignInButton label="Enviar código" disabled={!email} />
                </form>
              </section>
            ) : (
              <section className={styles.container}>
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
                    key={SIGN_IN_FIELDS.password.id}
                    label={SIGN_IN_FIELDS.password.field.label}
                    name={SIGN_IN_FIELDS.password.field.name}
                    type={SIGN_IN_FIELDS.password.type}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Input
                    key={SIGN_IN_FIELDS.confirmPassword.id}
                    label={SIGN_IN_FIELDS.confirmPassword.field.label}
                    name={SIGN_IN_FIELDS.confirmPassword.field.name}
                    type={SIGN_IN_FIELDS.confirmPassword.type}
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
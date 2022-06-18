import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import { useApp } from "@/context/AppContext";

import { LoginButton } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import Input from "@/components/common/Input";
import { Radio } from "@/components/common/Radio";

import { LOGIN_FIELDS } from "@/constants/FormFields";

import styles from '@/styles/pages/login.module.scss';
import { useAuth } from "@/context/AuthContainer";

export default function Login() {
  const history = useRouter();
  const auth = useAuth();
  const app = useApp();

  const [isAdm, setIsAdm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);

    auth.signIn(email, password)
      .then((isAuthenticated) => {
        setTimeout(() => {
          setEmail('');
          setPassword('');

          if (isAuthenticated) {
            app.setIsLoading(false);
            if (auth.user.isAdmin) {
              // history.push('/dashboard');
            } else {
              history.push('/registration-info');
            }
          }
        }, 3000);
      }).catch(err => app.setIsLoading(false));
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={app.isLoading} /> :
        (
          <Layout>
            <section className={styles.container}>
              <Title
                title="Login"
                subtitle="Faça login para acompanhar sua inscrição ou verificar alguma pendência" />

              <form onSubmit={handleSubmit}>
                <Radio
                  key={LOGIN_FIELDS.loginMode.id}
                  label={''}
                  options={LOGIN_FIELDS.loginMode.options}
                  name={LOGIN_FIELDS.loginMode.field.name}
                  selected={!isAdm ? 1 : 0}
                  onChange={e => setIsAdm(e.target.value === '1')}
                />

                <Input
                  key={LOGIN_FIELDS.email.id}
                  label={LOGIN_FIELDS.email.field.label}
                  name={LOGIN_FIELDS.email.field.name}
                  value={email}
                  type={LOGIN_FIELDS.email.type}
                  onChange={e => setEmail(e.target.value)}
                />

                <Input
                  key={LOGIN_FIELDS.password.id}
                  label={LOGIN_FIELDS.password.field.label}
                  name={LOGIN_FIELDS.password.field.name}
                  type={LOGIN_FIELDS.password.type}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <LoginButton label="acessar" />
              </form>
            </section>
          </Layout>
        )
      }
    </>
  )
}
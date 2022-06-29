import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";

import { LoginButton } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import Input from "@/components/common/Input";

import { LOGIN_FIELDS } from "@/constants/FormFields";

import styles from '@/styles/pages/login.module.scss';
import { useAuth } from "@/context/AuthContainer";

export default function Login() {
  const history = useRouter();
  const auth = useAuth();
  const app = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (auth.user.isAdmin) {
        history.push('/dashboard')
          .finally(() => app.setIsLoading(false));
      } else {
        history.push('/registration-info')
          .finally(() => app.setIsLoading(false));
      }
    } else {
      app.setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);

    auth.signIn(email, password)
      .then((isAuthenticated) => {
        setEmail('');
        setPassword('');
        setIsAuthenticated(isAuthenticated);
      }).catch(err => {
        console.log('signError', err);
      }).finally(() => {
        app.setIsLoading(false);
      });
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
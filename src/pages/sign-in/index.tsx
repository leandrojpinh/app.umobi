import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";

import { SignInButton } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import { Input, Password } from "@/components/common/Input";

import { SIGN_IN_FIELDS } from "@/constants/FormFields";

import { signInModule as styles } from '@/styles/pages';
import { useAuth } from "@/context/AuthContainer";
import Link from "next/link";

export default function SignIn() {
  const history = useRouter();
  const auth = useAuth();
  const app = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (auth.user.isAuthenticated) {
      if (auth.user.isAdmin || auth.user.isViewer) {
        history.push('/dashboard');
      } else {
        history.push('/profile');
      }
    }
  }, [auth.user.isAuthenticated]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);

    auth.signIn(email, password)
      .then(_ => {
        setEmail('');
        setPassword('');
      })
      .catch(err => {
        console.log('signError', err);
      })
      .finally(() => {
        app.setIsLoading(false);
      });
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={app.isLoading || auth.loading} /> :
        (
          <Layout title="Login">
            <section className={styles.container}>
              <Title
                title="Login"
                subtitle="Faça login para acompanhar sua inscrição ou verificar alguma pendência" />

              <form onSubmit={handleSubmit}>
                <Input
                  key={SIGN_IN_FIELDS.email.id}
                  label={SIGN_IN_FIELDS.email.field.label}
                  name={SIGN_IN_FIELDS.email.field.name}
                  value={email}
                  type={SIGN_IN_FIELDS.email.type}
                  onChange={e => setEmail(e.target.value)}
                />

                <Password
                  key={SIGN_IN_FIELDS.password.id}
                  label={SIGN_IN_FIELDS.password.field.label}
                  name={SIGN_IN_FIELDS.password.field.name}
                  type={isPasswordVisible ? 'text' : SIGN_IN_FIELDS.password.type}
                  onChange={e => setPassword(e.target.value)}
                  setIsVisible={() => setIsPasswordVisible(!isPasswordVisible)}
                  isVisible={isPasswordVisible}
                />

                <div className={styles.actions}>
                  <Link href={'/sign-in/forgot'}>
                    <a className={styles.forgot}>
                      Esqueci a senha
                    </a>
                  </Link>

                  <SignInButton label="acessar" />
                </div>
              </form>
            </section>
          </Layout>
        )
      }
    </>
  )
}
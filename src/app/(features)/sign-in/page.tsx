'use client'

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { SignInButton } from "@/components/ui/Button";
import { Layout } from "@/components/ui/Layout";
import { Loader } from "@/components/ui/Loader";
import { Title } from "@/components/ui/Text";
import { LOGIN_FIELDS } from "@/constants/FormFields";
import { Input, Password } from "@/components/ui/Input";

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
            <section className={'flex flex-col h-auto max-w-md my-0 mx-auto'}>
              <Title
                title="Login"
                subtitle="Faça login para acompanhar sua inscrição ou verificar alguma pendência" />

              <form className="flex flex-col w-full h-full" onSubmit={handleSubmit}>
                <Input
                  key={LOGIN_FIELDS.email.id}
                  label={LOGIN_FIELDS.email.field.label}
                  name={LOGIN_FIELDS.email.field.name}
                  value={email}
                  type={LOGIN_FIELDS.email.type}
                  onChange={e => setEmail(e.target.value)}
                />

                <Password
                  key={LOGIN_FIELDS.password.id}
                  label={LOGIN_FIELDS.password.field.label}
                  name={LOGIN_FIELDS.password.field.name}
                  type={isPasswordVisible ? 'text' : LOGIN_FIELDS.password.type}
                  onChange={e => setPassword(e.target.value)}
                  setIsVisible={() => setIsPasswordVisible(!isPasswordVisible)}
                  isVisible={isPasswordVisible}
                />

                <div className="flex flex-col">
                  <Link href={'/sign-in/forgot'}>
                    <span className={'text-app-primary-dark text-sm px-0 cursor-pointer tracking-widest transition-all duration-200 hover:brightness-90'}>
                      Esqueci a senha
                    </span>
                  </Link>

                  <SignInButton label="Acessar" />
                </div>
              </form>
            </section>
          </Layout>
        )
      }
    </>
  )
}
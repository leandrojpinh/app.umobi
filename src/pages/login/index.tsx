import { Button, LoginButton } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import { Topic } from "@/components/common/Topic"
import { FORM, FormRole } from "@/constants/FormRules";
import { LOCAL_STORAGE } from "@/constants/Storage";
import { useApp } from "@/context/AppContext";

import styles from '@/styles/pages/login.module.scss';
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import logo from '@/assets/logo.svg';
import { Radio } from "@/components/common/Radio";
import { FORM_COMPLEX_FIELDS, LOGIN_FIELDS } from "@/constants/FormFields";
import Input from "@/components/common/Input";

interface RoleProps {
  name: string;
  items: FormRole[];
}

export default function Login() {
  const router = useRouter();
  const app = useApp();

  useEffect(() => {
    app.setIsLoading(false);
  }, []);

  const [isAdm, setIsAdm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // app.setIsLoading(true);


    // app.setIsLoading(false);
    // router.push('/registration/form');
  }

  return (
    <Layout>
      <Loader loading={app.isLoading} />

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
            key={LOGIN_FIELDS.username.id}
            label={LOGIN_FIELDS.username.field.label}
            name={LOGIN_FIELDS.username.field.name}
            value={username}
            type={LOGIN_FIELDS.username.type}
            onChange={e => setUsername(e.target.value)}
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
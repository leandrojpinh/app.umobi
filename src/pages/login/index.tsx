import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import { Topic } from "@/components/common/Topic"
import { FORM, FormRole } from "@/constants/FormRules";
import { LOCAL_STORAGE } from "@/constants/Storage";
import { useApp } from "@/context/AppContext";

import styles from '@/styles/registration.module.scss';
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

interface RoleProps {
  name: string;
  items: FormRole[];
}

export default function Login() {
  const router = useRouter();
  const app = useApp();

  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    localStorage.setItem(LOCAL_STORAGE.agree, isChecked ? '1' : '0');

    app.setIsLoading(false);
    router.push('/registration/form');
  }

  return (
    <Layout>
      <Loader loading={app.isLoading} />
      <Title title="Login" />
    </Layout>
  )
}
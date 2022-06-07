import { Button } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { Layout } from "@/components/common/Layout"
import { Title } from "@/components/common/Title"
import { Topic } from "@/components/common/Topic"
import { FORM, FormRole } from "@/constants/FormRules";

import styles from '@/styles/registration.module.scss';
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

interface RoleProps {
  name: string;
  items: FormRole[];
}

const Role = ({ items, name }: RoleProps) => {
  let rows: string[] = [];
  items.forEach(item => {
    rows.push(item.description);

    if (item.options && item.options.length > 0) {
      rows = rows.concat(item.options);
    }
  });

  return (
    <div className={styles.role}>
      <strong>{name}</strong>
      {rows.map((row, index) => (
        <span key={index}>{row}</span>
      ))}
    </div>
  )
}

export default function Registration() {
  const router = useRouter();

  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    router.push('/registration/form');
  }

  return (
    <Layout>
      <Title
        title="Inscrição"
        subtitle="*Obs: idade mínima para participar é de 14 anos" />

      <section>
        <Topic title="Regras" />

        {FORM.map(({ id, name, items }) => <Role key={id} name={name} items={items} />)}

        <form onSubmit={handleSubmit}>
          <Checkbox label="Li e concordo" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} />

          <Button type={'submit'} label="Continuar" disabled={!isChecked} />
        </form>
      </section>
    </Layout>
  )
}
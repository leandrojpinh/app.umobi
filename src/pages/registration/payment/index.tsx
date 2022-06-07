import { Button } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";
import { Topic } from "@/components/common/Topic";

import { FormEvent, useState } from "react";

type IPaymentProps = {

}

export default function Payment() {
  const INITIAL_STATE: IPaymentProps = {

  };

  const [registration, setRegistration] = useState<IPaymentProps>(INITIAL_STATE);

  const changeField = (field: string, value: any) => {
    const newRegistration = {
      ...registration,
      [field]: value
    } as IPaymentProps;
    setRegistration(newRegistration);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log('registration', registration);
  }

  return (
    <Layout>
      <Title
        title="Inscrição"
        subtitle="*Obs: idade mínima para participar é de 14 anos" />

      <section>
        <Topic title="Comprovante de Pagamento" />

        <span>Taxa do Retiro</span>
        <strong>R$ 300,00</strong>

        <span>Dados para envio de pix/transferências</span>
        <span>654654654564654</span>
        <span>Banco: Nome do banco</span>
        <span>Tesoureiro: Nome da pessoa</span>

        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"/>

          <Button type={'submit'} label="Finalizar" onClick={() => { }} />
        </form>
      </section>
    </Layout>
  )
}
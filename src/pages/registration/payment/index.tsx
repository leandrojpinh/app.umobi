import { Button } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";
import { Topic } from "@/components/common/Topic";

import { FormEvent, useState, useEffect } from "react";

import { FileContainer } from '@/styles/pages/Payments';

import styles from '@/styles/payment.module.scss';
import { FiLayers, FiPaperclip } from "react-icons/fi";

import { IResponseProps, Response } from '@/components/common/Response';
import { LOCAL_STORAGE } from "@/constants/Storage";
import { useRouter } from "next/router";
import { useApp } from "@/context/AppContext";
import { Loader } from "@/components/common/Loader";

import { createPayment } from "@/services/umobi/umobi.api";
import { RegistrationPayment } from "@/services/umobi/models/Registration";
import Input from "@/components/common/Input";
import { FORM_COMPLEX_FIELDS } from "@/constants/FormFields";

export default function Payment() {
  const app = useApp();
  const router = useRouter();

  const [file, setFile] = useState<File>();
  const [tax, setTax] = useState(0);
  const [registrationId, setRegistrationId] = useState('');
  const [response, setResponse] = useState<IResponseProps>();

  useEffect(() => {
    app.setIsLoading(false);
  }, []);

  useEffect(() => {
    const hasAgreed = localStorage.getItem(LOCAL_STORAGE.agree);
    if (hasAgreed !== '1') {
      router.back();
    }

    const hasRegistration = localStorage.getItem(LOCAL_STORAGE.registrationId);
    if (!hasRegistration) {
      router.push('/registration/form');
    } else {
      setRegistrationId(JSON.parse(hasRegistration));
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    const registrationPayment = {
      registrationId: registrationId,
      tax: tax
    } as RegistrationPayment;

    createPayment(registrationPayment, file as File)
      .then(result => {
        console.log('SUCCCCC', result)
        setResponse({
          title: 'tudo certo!',
          message: 'Abaixo o código para acessar sua inscrição, não se preocupe, enviamos pora o seu e-mail também, verifica lá e não perca esse código.',
          type: 'success'
        });

        //SUCCESS
      })
      .catch(err => console.log('ERRR', err))
      .finally(() => {
        app.setIsLoading(false);
      });
  }

  const handleFile = (fileSelected?: File) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText("textToCopy");
  }

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        <Layout>
          {response ? (
            <Response type={response.type} message={response.message} title={response.title} />
          ) : (
            <>
              <Title
                title="Inscrição"
                subtitle="*Obs: idade mínima para participar é de 14 anos" />

              <section>
                <Topic title="Comprovante de Pagamento" />

                <div className={styles.info}>
                  <span>Taxa do Retiro</span>
                  <strong className={styles.tax}>R$ 300,00</strong>

                  <span>Dados para envio de pix/transferências</span>
                  <span>Chave Pix</span>
                  <div className={styles.pix}>
                    <span>
                      654654654564654
                    </span>
                    <button onClick={handleCopy}>Copiar <FiLayers height={18} color={'var(--primary-light)'} /></button>
                  </div>

                  <span>Banco: Nome do banco</span>
                  <span>Tesoureiro: Nome da pessoa</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <FileContainer>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => { handleFile(e.target.files ? e.target.files[0] : undefined) }} required />

                    <div>
                      <FiPaperclip height={18} color={'var(--primary-dark)'} />
                      {!file ? <span>Selecione o arquivo</span> : <span>{file.name}</span>}
                    </div>
                  </FileContainer>

                  <Input
                    className={styles.receipt}
                    key={FORM_COMPLEX_FIELDS.tax.id}
                    label={FORM_COMPLEX_FIELDS.tax.field.label}
                    name={FORM_COMPLEX_FIELDS.tax.field.name}
                    type={FORM_COMPLEX_FIELDS.tax.type}
                    value={tax}
                    onChange={e => setTax(parseInt(e.target.value))}
                  />

                  <Button type={'submit'} label="Finalizar" disabled={!file || !tax} />
                </form>
              </section>
            </>
          )}
        </Layout>
      }
    </>
  )
}
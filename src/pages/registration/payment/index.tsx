import { FormEvent, useState, useEffect } from "react";
import { FiLayers, FiPaperclip } from "react-icons/fi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { Button } from "@/components/common/Button";
import { Layout } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";
import { Topic } from "@/components/common/Topic";
import { Loader } from "@/components/common/Loader";
import Input from "@/components/common/Input";
import { Radio } from "@/components/common/Radio";
import { IResponseProps, Response } from '@/components/common/Response';
import { FileContainer } from '@/styles/pages/Payments';

import { useApp } from "@/context/AppContext";
import { useEmail } from "@/context/EmailProvider";

import { createPayment, getPendingPayments } from "@/services/umobi/umobi.api";
import { RegistrationPayment } from "@/services/umobi/models/Registration";

import { LOCAL_STORAGE } from "@/constants/Storage";
import { FORM_COMPLEX_FIELDS, PAYMENT_FIELDS } from "@/constants/FormFields";

import styles from '@/styles/payment.module.scss';
import { IRegistrationProps } from "../form";

export default function Payment() {
  const app = useApp();
  const history = useRouter();
  const email = useEmail();

  const [file, setFile] = useState<File>();
  const [tax, setTax] = useState(70);
  const [registrationId, setRegistrationId] = useState('');
  const [paymentMode, setPaymentMode] = useState('pix');
  const [response, setResponse] = useState<IResponseProps>();

  useEffect(() => {
    const hasAgreed = localStorage.getItem(LOCAL_STORAGE.agree);
    if (hasAgreed !== '1') {
      history.back();
    }

    const hasRegistration = localStorage.getItem(LOCAL_STORAGE.registrationId);
    if (!hasRegistration) {

      // eslint-disable-next-line react-hooks/exhaustive-deps
      history.push('/registration/form');
    } else {
      setRegistrationId(JSON.parse(hasRegistration));
    }
  }, [history]);

  useEffect(() => {
    if (tax < 70) {
      toast.warn('A tax mínima é R$ 70,00...');
    }
  }, [tax]);

  useEffect(() => {
    if (paymentMode === 'pix') {
      setTax(225);
    } else {
      setTax(70);
    }

  }, [paymentMode]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    const registrationPayment = {
      registrationId, tax, paymentMode
    } as RegistrationPayment;

    createPayment(registrationPayment, file as File)
      .then(_ => {
        const form = localStorage.getItem(LOCAL_STORAGE.form);
        if (form) {
          const userForm = JSON.parse(form) as IRegistrationProps;

          email.sendConfirmation({
            email: userForm.email,
            name: userForm.name,
            data: new Date().toLocaleString()
          }).then(_ => {
            localStorage.clear();

            toast.success('Você já pode fazer Login e acompanhar sua inscrição :)');

            setResponse({
              title: 'tudo certo!',
              message: 'Sua inscrição foi enviada. Assim que for confirmada você receberá um e-mail avisando que foi aprovado, ou se precisa fazer algum ajuste no comprovante. Até lá!',
              type: 'success'
            });
          }).catch(err => console.log(err));
        } else {
          toast.warn('Houve um problema na comunicação, verifica se preencheu o formulário certinho. ')

          setTimeout(() => {
            history.push('/registration/form');
          }, 3000);
        }
      })
      .then(_ => getPendingPayments().then(count => email.sendNew(count)))
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
      {app.isLoading || email.isSending ? <Loader loading={app.isLoading || email.isSending} /> :
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
                  <strong>Taxa do Retiro</strong>
                  <strong className={styles.tax}>R$ 225,00 <span>a partir de 16/out R$ 250,00.</span></strong>

                  <strong>Dados para envio de pix/transferências</strong>
                  <span>Chave Pix</span>
                  <div className={styles.pix}>
                    <span>
                      (85) 99244-2092
                    </span>
                    <button onClick={handleCopy}>Copiar <FiLayers height={18} color={'var(--primary-light)'} /></button>
                  </div>

                  <span>Banco: NU Pagamentos</span>
                  <span>Tesoureiro: Wisley Silva dos Santos</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <section className={styles.paymentMode}>
                    <Radio
                      key={PAYMENT_FIELDS.paymentMode.id}
                      label={PAYMENT_FIELDS.paymentMode.field.label}
                      options={PAYMENT_FIELDS.paymentMode.options}
                      name={PAYMENT_FIELDS.paymentMode.field.name}
                      subLabel={PAYMENT_FIELDS.paymentMode.field.subLabel}
                      selected={paymentMode}
                      onChange={e => setPaymentMode(e.target.value)}
                    />
                  </section>
                  <FileContainer>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => { handleFile(e.target.files ? e.target.files[0] : undefined) }} required />

                    <div>
                      <FiPaperclip height={18} color={'var(--text)'} />
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

                  <Button type={'submit'} label="Finalizar" disabled={!file || (!tax || tax < 70)} />
                </form>
              </section>
            </>
          )}
        </Layout>
      }
    </>
  )
}
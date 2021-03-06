import { FormEvent, useState, useEffect } from "react";
import { FiPaperclip } from "react-icons/fi";
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
import { CampDetails } from "@/components/common/CampDetails";

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
      toast.warn('A tax m??nima ?? R$ 70,00...');
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

          email.sendRegistration({
            email: userForm.email,
            name: userForm.name,
            data: new Date().toLocaleString()
          }).then(_ => {
            localStorage.clear();

            toast.success('Voc?? j?? pode fazer Login e acompanhar sua inscri????o :)');

            setResponse({
              title: 'tudo certo!',
              message: 'Sua inscri????o foi enviada. Assim que for confirmada voc?? receber?? um e-mail avisando que foi aprovado, ou se precisa fazer algum ajuste no comprovante. At?? l??!',
              type: 'success'
            });
          }).catch(err => console.log(err));

          history.push('/');
          toast.success('Voc?? j?? pode fazer Login e acompanhar sua inscri????o :)');
        } else {
          toast.warn('Houve um problema na comunica????o, verifica se preencheu o formul??rio certinho. ')

          setTimeout(() => {
            history.push('/registration/form');
          }, 3000);
        }
      })
      // .then(_ => getPendingPayments().then(count => email.sendNew(count)))
      .catch(err => console.log('ERRR', err))
      .finally(() => {
        app.setIsLoading(false);
      });
  }

  const handleFile = (fileSelected?: any) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
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
                title="Inscri????o"
                subtitle="*Obs: idade m??nima para participar ?? de 14 anos" />

              <section>
                <Topic title="Comprovante de Pagamento" />

                <CampDetails />

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
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => { handleFile(e.target.files![0]) }} required />

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
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { FormEvent, useEffect, useState } from "react";
import { FiCheck, FiClock, FiFileText } from 'react-icons/fi';
import moment from "moment";
import { ParsedUrlQuery } from 'querystring';
import { toast } from "react-toastify";

import { LayoutAdmin } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";

import styles from '@/styles/pages/dashboard.registration.module.scss';
import { Info, InfoGroup } from "@/components/common/Info";
import { Back } from "@/components/common/Back";
import { Topic } from "@/components/common/Topic";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContainer";
import { evaluatePayment, getForm, getPayments } from "@/services/umobi/umobi.api";
import { RegistrationPaymentProps } from "@/model/entities/Registration";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";
import { toMoney } from "@/helper/utils";
import { useEmail } from "@/context/EmailProvider";

type DashboardPaymentProps = {
  registrationId: string
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export default function DashboardRegistration({ registrationId }: DashboardPaymentProps) {
  const history = useRouter();
  const auth = useAuth();
  const email = useEmail();

  const [payments, setPayments] = useState<RegistrationPayment[]>();
  const [form, setForm] = useState<RegistrationForm>();

  const [confirmationTax, setConfirmationTax] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPaymentProps>();

  useEffect(() => {
    if (auth) {
      if (!auth.user.isAdmin) {
        history.push('/');
      }
    }
  }, [auth]);

  useEffect(() => {
    if (registrationId) {
      getPayments(registrationId).then(response => {
        const formatedPayments = response.map(payment => {
          return {
            createdAt: moment(payment.createdAt).format('DD/MM/yyyy'),
            registrationId: payment.registrationId,
            tax: payment.tax,
            paymentMode: payment.paymentMode,
            paymentUrl: payment.paymentUrl,
            validated: payment.validated,
            id: payment.id
          } as RegistrationPayment
        });

        setPayments(formatedPayments);
      }).catch(err => {
        toast.error("Erro ao listar os comprovantes, ver nos logs");
        console.log('ERR73', err);
      });

      getForm(registrationId).then(response => {
        setForm(response);
      }).catch(err => {
        toast.error("Erro ao listar as inscrições, ver nos logs");
        console.log(err)
      });
    }
  }, [selectedPayment?.validated]);

  const handleSelectPayment = (obj: RegistrationPaymentProps) => {
    setSelectedPayment(obj);
  }

  const handleEvaluatePayment = (e: FormEvent) => {
    e.preventDefault();

    if (selectedPayment?.tax.toString() !== confirmationTax) {
      toast.warn('Verifique se o valor informado está correto.')
    } else {
      evaluatePayment({ paymentId: selectedPayment.id!, validated: true }).then(response => {
        email.sendConfirmation({
          email: form?.registration?.user?.email!,
          name: form?.registration?.user?.name!,
          data: new Date().toLocaleString()
        }).then(_ => {
          toast.success('Valor do comprovante confirmado!');
        }).catch(err => {
          toast.error('Erro ao enviar e-mail, ver nos logs');
          console.log('ERR100', err);
        });

        setSelectedPayment(response);
      }).catch(err => {
        toast.error('Erro ao confirmar comprovante, ver nos logs');
        console.log('ERR103', err);
      });
    }
  }

  const handleRejectPayment = () => {
    if (selectedPayment) {
      evaluatePayment({ paymentId: selectedPayment.id!, validated: false }).then(response => {

        console.log('enviado email de rejeição');
        email.sendRejection({
          email: form?.registration?.user?.email!,
          name: form?.registration?.user?.name!,
          data: new Date().toLocaleString()
        }).then(_ => {
          toast.success('Valor do comprovante rejeitado, enviamos um e-mail para correção.');
        }).catch(err => {
          toast.error("Erro ao enviar e-mail de rejeição do comprovante, ver nos logs");
          console.log('ERR124', err);
        });

        setSelectedPayment(response);
      }).catch(err => {
        toast.error("Erro ao rejeitar comprovante, ver nos logs");
        console.log('ERR130', err);
      });
    }
  }

  return (
    <LayoutAdmin>
      <Back />
      <Title title={form?.registration?.user?.name || ''} />

      <div className={styles.container}>
        <section className={styles.side}>
          <InfoGroup>
            <Info label={'E-mail'} text={form?.registration?.user?.email || ''} />
            <Info label={'Telefone'} text={form?.registration?.user?.phoneNumber || ''} />
          </InfoGroup>
          <InfoGroup>
            <Info label={'Data de Nascimento'} text={moment(form?.registration?.user?.birthDate).format('DD/MM/yyyy')} />
            <Info label={'Nome dos pais'} text={form?.registration?.user?.parentNames || ''} />
          </InfoGroup>
          <InfoGroup>
            <Info label={'Endereço'} text={form?.registration?.user?.address || ''} />
          </InfoGroup>

          <ul>
            <Topic title="Comprovantes" />
            {payments?.map(item => (
              <li key={item.id} className={`${item.validated ? styles.validated : ''} ${selectedPayment?.id === item.id ? styles.selected : ''}`} onClick={() => handleSelectPayment(item)}>
                <FiFileText size={24} />
                <div>
                  <span>{item.createdAt}</span>
                  <span>{toMoney(`${item.tax}`)}</span>
                  <span>{`${item.validated ? 'Validado' : ''}`}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.side}>
          {
            selectedPayment && (
              <>
                <div className={styles.registrationInfo}>
                  <Topic title="Validar comprovante de Pagamento" />
                  <img src={selectedPayment.paymentUrl} />

                  <div className={styles.info}>
                    {selectedPayment.validated ? (
                      <>
                        <span>O comprovante já foi validado!</span>
                        <FiCheck size={36} color={'var(--text)'} />
                      </>
                    ) : (
                      <>
                        <span>O valor do comprovante deve ser: {toMoney(`${selectedPayment.tax}`)}</span>
                        <FiClock size={36} color={'var(--text)'} />
                      </>
                    )}
                  </div>
                </div>
                {!selectedPayment.validated && (
                  <form onSubmit={handleEvaluatePayment} className={styles.validation}>
                    <Input type={'number'} name="confirmationTax" label="Qual o valor do comprovante?" value={confirmationTax} onChange={(e) => setConfirmationTax(e.target.value)} />
                    <div>
                      <Button styleType='cancel' label="Tá errado" onClick={handleRejectPayment}></Button>
                      <Button label="Validado" type="submit"></Button>
                    </div>
                  </form>
                )}
              </>
            )
          }
        </section>
      </div>
    </LayoutAdmin>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: 'blocking',
    paths: []
  }
}

export const getStaticProps: GetStaticProps<DashboardPaymentProps, Params> = async (context) => {
  const { id } = context.params!;

  return {
    props: {
      registrationId: id
    },
    revalidate: 60
  }
}
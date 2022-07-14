import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { FormEvent, useEffect, useState } from "react";
import { FiFileText } from 'react-icons/fi';
import moment from "moment";
import { ParsedUrlQuery } from 'querystring';
import { toast } from "react-toastify";

import { LayoutAdmin } from "@/components/common/Layout";
import { Title } from "@/components/common/Title";

import { Info, InfoGroup } from "@/components/common/Info";
import { Back } from "@/components/common/Back";
import { Topic } from "@/components/common/Topic";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContainer";
import { evaluatePayment, getForm, getPayments } from "@/services/umobi/umobi.api";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";
import { getBooleanAnswer, toMoney } from "@/helper/utils";
import { useEmail } from "@/context/EmailProvider";

import styles from '@/styles/pages/dashboard.registration.module.scss';

type DashboardPaymentProps = {
  registrationId: string
}

interface Params extends ParsedUrlQuery {
  id: string;
}

type ValidationType = 'accepted' | 'rejected';

export default function DashboardRegistration({ registrationId }: DashboardPaymentProps) {
  const history = useRouter();
  const auth = useAuth();
  const email = useEmail();

  const [payments, setPayments] = useState<RegistrationPayment[]>();
  const [form, setForm] = useState<RegistrationForm>();

  const [confirmationTax, setConfirmationTax] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPayment>();

  const [validationType, setValidationType] = useState<ValidationType>();
  const [validation, setValidation] = useState('');

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
            ...payment,
            createdAt: moment(payment.createdAt).utc().format('DD/MM/yyyy'),
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
        console.log(err);
      });
    }
  }, [selectedPayment?.validated]);

  const handleSelectPayment = (obj: RegistrationPayment) => {
    setSelectedPayment(obj);
  }

  const handleEvaluatePayment = (e: FormEvent) => {
    e.preventDefault();

    if (selectedPayment?.tax.toString() !== confirmationTax) {
      toast.warn('Verifique se o valor informado está correto.')
    } else {
      if (validationType === "accepted") {
        evaluatePayment({ paymentId: selectedPayment.id!, rejected: false }).then(response => {
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
      } else {
        evaluatePayment({ paymentId: selectedPayment.id!, rejected: true, reason: 'Valor incorreto.' }).then(response => {
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
  }

  return (
    <LayoutAdmin>
      <Back />
      <Title title={form?.registration?.user?.name || ''} />

      <div className={styles.container}>
        <section className={styles.side}>
          <div className={styles.personData}>
            <InfoGroup>
              <Info label={'E-mail'} text={form?.registration?.user?.email!} />
              <Info label={'Telefone'} text={form?.registration?.user?.phoneNumber!} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Data de Nascimento'} text={moment(form?.registration?.user?.birthDate).utc().format('DD/MM/yyyy')} />
              <Info label={'Nome dos pais'} text={form?.registration?.user?.parentNames!} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Endereço'} text={form?.registration?.user?.address!} />
              <Info label={'Igreja'} text={form?.churchName!} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Nome do Pastor'} text={form?.ministerName!} />
              <Info label={'Telefone do Pastor'} text={form?.ministerNumber!} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Pastor está ciente?'} text={getBooleanAnswer(form?.ministerApproval!)} />
              <Info label={'Sabe nadar?'} text={getBooleanAnswer(form?.canSwim!)} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Tem alguma alergia?'} text={getBooleanAnswer(form?.isAllergic!)} />
              <Info label={'Nome do remédio'} text={form?.medicineName || '-'} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'É crente em Jesus?'} text={getBooleanAnswer(form?.isBeliever!)} />
              <Info label={'Está comprometido com as regras?'} text={getBooleanAnswer(form?.isResponsable!)} />
            </InfoGroup>
            {form?.moreInformation && <InfoGroup>
              <Info label={'Informações adicionais'} text={form?.moreInformation} />
            </InfoGroup>}
          </div>
          <ul>
            <Topic title="Comprovantes" />
            {payments?.map(item => (
              <li key={item.id} className={`${item.validated ? styles.validated : ''} ${selectedPayment?.id === item.id ? styles.selected : ''}`} onClick={() => handleSelectPayment(item)}>
                <FiFileText size={24} />
                <div>
                  <span>{item.createdAt}</span>
                  <span>{toMoney(`${item.tax}`)}</span>
                  <span>{item.paymentMode}</span>
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
                  {selectedPayment.publicPaymentUrl?.includes('.pdf') ? (
                    <embed src={selectedPayment.publicPaymentUrl} height="500" type='application/pdf'>

                    </embed>
                  ) : (
                    <img src={selectedPayment.publicPaymentUrl} alt="Comprovante" />
                  )}

                  <div className={styles.info}>
                    {selectedPayment.validated ? (
                      <span>O comprovante{!selectedPayment.rejected ? ' já foi validado' : ' foi rejeitado'}!</span>
                    ) : (
                      <span>O valor do comprovante deve ser: {toMoney(`${selectedPayment.tax}`)}</span>
                    )}
                  </div>
                </div>
                {!selectedPayment.validated && (
                  <>
                    <form onSubmit={handleEvaluatePayment} className={styles.validation}>
                      <Input type={'number'} name="confirmationTax" label="Qual o valor do comprovante?" value={confirmationTax} onChange={(e) => setConfirmationTax(e.target.value)} />

                      {!validationType ? (
                        <div className={styles.toValidate}>
                          <Button type="button" styleType='cancel' label="Tá errado" onClick={() => setValidationType('rejected')} disabled={!confirmationTax}></Button>
                          <Button label="Validar" type="button" onClick={() => setValidationType('accepted')} disabled={!confirmationTax}></Button>
                        </div>
                      ) : (
                        <div className={styles.toConfirm}>
                          <Input type={'text'} name='validation' label="Para confirmar digite: confirmar" value={validation} onChange={(e) => setValidation(e.target.value)} />
                          {validation === 'confirmar' && <Button label="Salvar" type="submit"></Button>}
                        </div>
                      )}
                    </form>
                  </>
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
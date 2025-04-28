'use client';

import { useRouter } from "next/navigation";
import { GetStaticPaths, GetStaticProps } from "next";
import { FormEvent, useEffect, useState } from "react";
import { FiFileText } from 'react-icons/fi';
import moment from "moment";
import { ParsedUrlQuery } from 'querystring';
import { toast } from "react-toastify";

import { evaluatePayment, getCurrentCamp, getForm, getPayments } from "@/services/umobi/umobi.api";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";
import { getBooleanAnswer, toMoney } from "@/helper/utils";
import Image from "next/image";
//import { SendConfirmation, SendRejection } from "@/services/email/email";
import { useAuth } from "@/contexts/AuthContext";
import { useEmail } from "@/contexts/EmailProvider";
import { LayoutAdmin } from "@/components/ui/Layout";
import { Back, Button } from "@/components/ui/Button";
import { Title, Topic } from "@/components/ui/Text";
import { Info, InfoGroup } from "@/components/ui/Info";
import { Input } from "@/components/ui/Input";
import { SendCharge, SendConfirmation, SendRejection } from "@/services/email/email";
import { Camp } from "@/services/umobi/models/Camp";

type DashboardPaymentProps = {
  params: { registrationId: string };
}

type ValidationType = 'accepted' | 'rejected';

export default function DashboardRegistration({ params }: DashboardPaymentProps) {
  const auth = useAuth();
  const email = useEmail();
  const [payments, setPayments] = useState<RegistrationPayment[]>();
  const [form, setForm] = useState<RegistrationForm>();
  const [camp, setCamp] = useState<Camp>();

  const [confirmationTax, setConfirmationTax] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPayment>();

  const [validationType, setValidationType] = useState<ValidationType>();
  const [validation, setValidation] = useState('');
  const [toConfirm, setToConfirm] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Confirmar');

  useEffect(() => {
    if (params.registrationId) {
      getPayments(params.registrationId).then(response => {
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

      getForm(params.registrationId).then(response => {
        setForm(response);
      }).catch(err => {
        toast.error("Erro ao listar as inscrições, ver nos logs");
        console.log(err);
      });

      getCurrentCamp().then(res => {
        setCamp(res);
      }).catch(err => console.log('error ao buscar evento.'))
    }
  }, [params.registrationId, selectedPayment?.validated]);

  const handleSelectPayment = (obj: RegistrationPayment) => {
    if (!!selectedPayment && selectedPayment.id === obj.id) {
      setSelectedPayment(undefined);

      return;
    }
    setSelectedPayment(obj);
  }

  const handleEvaluatePayment = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedPayment) {
      if (validationType === "accepted") {
        if (selectedPayment?.tax.toString() !== confirmationTax.toString() && !toConfirm) {
          toast.warn('Atenção!!! O valor do comprovante está diferente, do esperado...');
          toast.info('Para confirmar, clique em "Estou ciente".');
          setButtonLabel('Estou ciente');
          setToConfirm(true);

          return;
        }

        try {
          const evaluateResponse = await evaluatePayment({ paymentId: selectedPayment.id!, rejected: false, tax: confirmationTax });
          const res = await email.sendConfirmation({
            email: form?.registration?.user?.email!,
            name: form?.registration?.user?.name!,
            data: new Date().toLocaleString()
          });

          if (res) {
            const mail = await SendConfirmation({
              email: form?.registration?.user?.email!,
              name: form?.registration?.user?.name!,
              eventName: camp?.name
            })

            if (mail.data?.id) {
              toast.success('Valor do comprovante confirmado!');
            }
          }

          setSelectedPayment(evaluateResponse);
        } catch (err) {
          toast.error('Erro ao enviar e-mail, ver nos logs');
          console.log('ERR100', err);
        }
      } else {
        try {
          const evaluateResponse = await evaluatePayment({ paymentId: selectedPayment.id!, rejected: true, reason: 'Valor incorreto.' });
          const res = await email.sendRejection({
            email: form?.registration?.user?.email!,
            name: form?.registration?.user?.name!,
            data: new Date().toLocaleString()
          });

          if (res) {
            const mail = await SendRejection({
              email: form?.registration?.user?.email!,
              name: form?.registration?.user?.name!,
              eventName: camp?.name
            })

            if (mail.data?.id) {
              toast.success('Valor do comprovante rejeitado, enviamos um e-mail para correção.');
            }
          }

          setSelectedPayment(evaluateResponse);
        } catch (err) {
          toast.error("Erro ao enviar e-mail de rejeição do comprovante, ver nos logs");
          console.log('ERR100', err);
        }
      }
    }
  }

  const handleSendCharge = async () => {
    try {
      const mail = await SendCharge({
        email: form?.registration?.user?.email!,
        name: form?.registration?.user?.name!,
        eventName: camp?.name
      })

      if (mail.data?.id) {
        toast.success('Cobrança enviada!');
      }
    } catch (err) {
      console.log('asdasd', err);
      toast.error('error');
    }
  }

  return (
    <LayoutAdmin title={form?.registration?.user?.name || ''} hasBackdrop>
      <Back />
      <Title title={form?.registration?.user?.name || ''} />

      <div className={'flex flex-col lg:flex-row gap-8'}>
        <section className={'flex flex-col flex-1'}>
          <div>
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

          {!!payments && payments.length ? (
            <ul className="flex flex-col list-none flex-1 mt-8">
              <Topic title="Comprovantes" />
              {payments?.map(item => (
                <li key={item.id} className={`flex items-center justify-between border-dashed border-[1px] border-app-black-light p-4 rounded-md cursor-pointer mb-4 transition-all duration-200 hover:brightness-90 ${item.validated ? 'bg-app-black-dark' : ''} ${selectedPayment?.id === item.id ? 'bg-app-black-light border-app-placeholder' : ''}`} onClick={() => handleSelectPayment(item)}>
                  <FiFileText size={24} />
                  <div className="flex gap-4">
                    <span>{item.createdAt}</span>
                    <span>{toMoney(`${item.tax}`)}</span>
                    <span>{item.paymentMode}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col list-none flex-1 mt-8">
              <Topic title="Comprovantes" />
              <span>Nenhum comprovante encontrado...</span>

              <Button type={'button'} label="Enviar e-mail de cobrança!" onClick={handleSendCharge} />
            </ul>
          )}
        </section>
        <section className={'flex flex-col flex-1'}>
          {
            selectedPayment && (
              <>
                <div className={'flex flex-col h-auto'}>
                  <Topic title="Validar comprovante de Pagamento" />
                  {selectedPayment.publicPaymentUrl?.includes('.pdf') ? (
                    <embed className="w-full pb-4" src={selectedPayment.publicPaymentUrl} height="500" type='application/pdf'>

                    </embed>
                  ) : (
                    <div className={"w-full pb-4"}>
                      <Image src={selectedPayment.publicPaymentUrl!} alt="Comprovante" objectFit="cover" width={500} height={500} className="w-full h-full top-0 left-0 object-cover" />
                    </div>
                  )}

                  {auth.user.isAdmin && <div className={'items-center justify-between flex gap-4 mb-4'}>
                    {selectedPayment.validated ? (
                      <span>O comprovante{!selectedPayment.rejected ? ' já foi validado' : ' foi rejeitado'}!</span>
                    ) : (
                      <span>O valor do comprovante deve ser: {toMoney(`${selectedPayment.tax}`)}</span>
                    )}
                  </div>}
                </div>
                {(!selectedPayment.validated && auth.user.isAdmin) && (
                  <>
                    <form onSubmit={handleEvaluatePayment} className={'flex flex-col'}>
                      <Input type={'number'} name="confirmationTax" label="Qual o valor do comprovante?" value={confirmationTax} onChange={(e) => setConfirmationTax(parseFloat(e.target.value))} />

                      {!validationType ? (
                        <div className={'mb-0'}>
                          <Button type="button" styleType='cancel' label="Tá errado" onClick={() => setValidationType('rejected')} disabled={!confirmationTax}></Button>
                          <Button label={buttonLabel} type="button" onClick={() => setValidationType('accepted')} disabled={!confirmationTax}></Button>
                        </div>
                      ) : (
                        <div className={'flex flex-1 flex-col mt-4 gap-0'}>
                          <Input type={'text'} name='validation' label="Para confirmar digite: confirmar" value={validation} onChange={(e) => setValidation(e.target.value)} />
                          {validation === 'confirmar' && <Button label={buttonLabel} type="submit"></Button>}
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
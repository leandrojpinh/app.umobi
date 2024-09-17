'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, FormEvent } from "react";
import moment from "moment";
import { v4 as uuid } from 'uuid';

import { createPayment, getPayments, getUserInfo, removeReceipt } from "@/services/umobi/umobi.api";
import { UserInfo } from "@/services/umobi/models/UserInfo";

import { Registration, RegistrationPayment } from "@/services/umobi/models/Registration";
import Image from "next/image";
import { FiFileText, FiPlus } from "react-icons/fi";
import { PAYMENT_FIELDS } from "@/constants/FormFields";
import { toMoney } from "@/helper/utils";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Loader } from "@/components/ui/Loader";
import { Layout } from "@/components/ui/Layout";
import { Back, ButtonRemove } from "@/components/ui/Button";
import { Title, Topic } from "@/components/ui/Text";
import { CampDetails } from "@/components/ui/CampDetails";
import { PaymentForm } from "@/components/pages/PaymentForm";
import { Info, InfoGroup } from "@/components/ui/Info";
import { SendRegistration } from "@/services/email/email";

const INITIAL_STATE_PAYMENT: RegistrationPayment = {
  paymentMode: 'pix',
  registrationId: '',
  tax: 250
};

export default function Profile() {
  const auth = useAuth();
  const app = useApp();
  const history = useRouter();

  const [selectedRegistration, setSelectedRegistration] = useState<Registration>();

  const [file, setFile] = useState<File>();
  const [payment, setPayment] = useState<RegistrationPayment>(INITIAL_STATE_PAYMENT);
  const [paymentError, setPaymentError] = useState('');
  const [createNew, setCreateNew] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPayment>();
  const [userPayments, setUserPayments] = useState<RegistrationPayment[]>();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    app.setIsLoading(false);
    getUserInfo().then(res => {
      const userData = {
        ...res,
        birthDate: moment(res.birthDate).utc().format('DD/MM/yyyy')
      } as UserInfo;
      app.setUserInfo(userData);

      if (res.registrations?.length === 1) {
        setSelectedRegistration(res.registrations[0]);
      }
    }).catch(err => {
      console.log('ERRO76', err);
      history.push('/');
    }).finally(() => {
      app.setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedRegistration?.id) {
      getPayments(selectedRegistration?.id).then(response => {
        const formatedPayments = response.map(payment => {
          return {
            ...payment,
            createdAt: moment(payment.createdAt).utc().format('DD/MM/yyyy'),
          } as RegistrationPayment
        });

        setUserPayments(formatedPayments);
      }).catch(err => {
        toast.error("Erro ao listar os comprovantes, ver nos logs");
        console.log('ERR73', err);
        return [];
      });
    }

  }, [selectedRegistration?.id, reload]);

  useEffect(() => {
    const value = payment.paymentMode === 'pix' ? 250 : (totalPaid !== undefined && totalPaid > 0) ? 150 : 100;
    changePaymentField(PAYMENT_FIELDS.tax.field.name, value);
  }, [payment.paymentMode]);

  const { isPaymentsPaid, totalPaid } = useMemo(() => {
    const totalPaid = userPayments?.filter(f => !f.rejected)?.reduce((acc, item) => acc + item.tax, 0);

    return {
      isPaymentsPaid: totalPaid != undefined && totalPaid >= selectedRegistration?.camp.tax!,
      totalPaid
    };
  }, [userPayments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setPaymentError('Selecionar um arquivo');
      return;
    }

    if (payment.paymentMode !== 'pix' && payment.tax < 100) {
      setPaymentError('O valor mínimo da entrada é de R$ 100,00');
      return;
    }

    app.setIsLoading(true);
    try {
      const newPayment = {
        ...payment,
        registrationId: selectedRegistration?.id
      } as RegistrationPayment;

      const response = await createPayment(newPayment, file);
      console.log('response', response);
      const mail = await SendRegistration({
        email: app.userInfo?.email!,
        name: app.userInfo?.name!,
        eventName: selectedRegistration?.camp.name
      });

      if (mail.data?.id) {
        setSelectedPayment(undefined);
        onClose();
        toast.success('Comprovante enviado com sucesso!');
        setReload(true);
      }
    }
    catch (err) {
      console.log('ERRR', err);
      toast.warn("Tivemos um problema ao enviar o comprovante, atualize a página.")
    } finally {
      app.setIsLoading(false);
    }
  }

  const handleRemoveReceipt = (paymentId: string) => {
    app.setIsLoading(true);
    removeReceipt(paymentId).then(() => {
      toast.success("Comprovante removido com sucesso.")
      const payments = userPayments?.filter(f => f.id !== paymentId);
      setUserPayments(payments);
    }).catch(err => {
      console.log('ERR145', err);
      toast.warn("Tivemos um problema ao remover seu comprovantes, atualize a página.")
    }).finally(() => {
      app.setIsLoading(false);
    });
  }

  const handleItem = (item: RegistrationPayment) => {
    selectedPayment ? setSelectedPayment(undefined) : setSelectedPayment(item);

    setCreateNew(false);
  }

  const handleFile = (fileSelected?: File) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }

  const changePaymentField = (field: string, value: any) => {
    setPayment({ ...payment, [`${field}`]: value });
  }

  const onOpen = () => {
    if (totalPaid !== undefined && totalPaid > 0) {
      setPayment({ ...payment, paymentMode: '1x', tax: 125 });
    }

    setCreateNew(true);
  }

  const onClose = () => {
    setFile(undefined);
    setPayment(INITIAL_STATE_PAYMENT);
    setPaymentError('');
    setCreateNew(false);
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={auth.loading || app.isLoading} /> :
        (
          <>
            {createNew ?
              <>
                <Layout title="Perfil" hasBackdrop>
                  <Back onClick={() => onClose()} />
                  <Title title='Envio de comprovante' />

                  <CampDetails />
                  <PaymentForm
                    key={'profile-payment'}
                    file={file}
                    onFileChange={handleFile}
                    submit={handleSubmit}
                    onPaymentChange={changePaymentField}
                    payment={payment}
                    payments={userPayments || []}
                    error={paymentError}
                  />
                </Layout>
              </> : <>
                <Layout title="Perfil" hasBackdrop>
                  <Title title={`${app.userInfo.name.split(' ').slice(0, 2).join(' ')}`} />

                  {app.userInfo !== undefined && (
                    <div className={'flex flex-col flex-1'}>
                      <InfoGroup>
                        <Info label={'E-mail'} text={app.userInfo.email!} />
                        <Info label={'Telefone'} text={app.userInfo.phoneNumber!} />
                      </InfoGroup>
                      <InfoGroup>
                        <Info label={'Data de Nascimento'} text={app.userInfo.birthDate} />
                        <Info label={'Nome dos pais'} text={app.userInfo.parentNames!} />
                      </InfoGroup>
                      <InfoGroup>
                        <Info label={'Endereço'} text={app.userInfo.address!} />
                      </InfoGroup>
                    </div>
                  )}

                  {selectedRegistration !== undefined && app.userInfo.registrations.length > 0 && (
                    <section className={'flex flex-col my-2 mx-0'}>
                      <Topic title="Inscrições" />
                      <ul className="gap-4 rounded-md flex w-fit">
                        {app.userInfo.registrations.map((evt, index) => (
                          <li key={index} onClick={() => setSelectedRegistration(evt)} className={`flex flex-1 h-full cursor-pointer transition-all duration-200 rounded-md border-solid border-[.2rem] border-[transparent] hover:brightness-90 ${evt.camp.name === selectedRegistration.camp.name ? 'border-app-primary-light' : ''}`}>
                            <Image className="rounded-md h-full" src={'/folder.svg'} alt={evt.camp.name} objectFit='contain' width={120} height={140} />
                          </li>
                        ))}
                      </ul>
                      <span className="mt-4">{`${selectedRegistration !== undefined ? selectedRegistration.camp.name : 'Selecione uma inscrição'}`}</span>
                    </section>
                  )}

                  {selectedRegistration !== undefined && (
                    <section>
                      <ul className="flex flex-col list-none flex-1 mt-8">
                        <Topic title="Comprovantes" />
                        {!isPaymentsPaid && (
                          <li key={uuid()} className={`font-app-text flex flex-col justify-center border-[1px] border-dashed border-app-text p-4 rounded-md mb-4 transition-all duration-200 hover:brightness-90 ${createNew ? 'transition-none hover:filter-none' : ''}`}>
                            <div className={'flex justify-between text-xl bg-app-black-light rounded-md cursor-pointer -m-4 p-4'} onClick={onOpen}>
                              <span>Enviar comprovante</span>
                              <FiPlus size={24} color={'var(--text)'} />
                            </div>
                          </li>
                        )}
                        {userPayments?.map(item => (
                          <li key={item.id} className={`flex flex-col justify-between border-[1px] border-dashed border-app-black-light p-4 rounded-md mb-4 transition-all duration-200 hover:brightness-90 ${selectedPayment?.id === item.id ? 'bg-app-black-light border-app-primary-light' : ''} ${item.rejected ? 'border-app-error' : ''}`}>
                            <div className={`font-app-text flex items-center justify-between rounded-md -m-4 p-4 ${item.validated ? 'bg-app-black-dark' : ''}`} onClick={() => handleItem(item)}>
                              <div className="flex gap-4">
                                <FiFileText size={24} />
                                <span>{item.validated && !item.rejected ? 'Validado' : item.validated && item.rejected ? 'Rejeitado' : 'Aguardando validação'}</span>
                              </div>
                              <div className="flex gap-4">
                                <span className={'sm:flex-none'}>{item.createdAt}</span>
                                <span>{toMoney(`${item.tax}`)}</span>
                                <span>{item.paymentMode}</span>
                              </div>
                            </div>
                            {(selectedPayment && item.id === selectedPayment.id) && (
                              <section className={`flex flex-col m-0 mt-4 font-app-text`}>
                                {selectedPayment.validated && selectedPayment.rejected ? (
                                  <>
                                    <span className="my-4">O comprovante foi rejeitado! Basta remover e enviar o comprovante correto.</span>
                                    <span className={'p-2 flex bg-app-black-dark rounded-md text-app-text2 mt-0'}>{selectedPayment.reason}</span>
                                    <ButtonRemove label="Remover" onClick={() => handleRemoveReceipt(selectedPayment.id!)} />
                                  </>
                                ) : selectedPayment.validated && !selectedPayment.rejected ? (
                                  <span className="my-4">O comprovante já foi validado!</span>
                                ) : (
                                  <span className="my-4">Pendente de validação, em breve você receberá um e-mail com o novo status.</span>
                                )}
                              </section>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </Layout>
              </>
            }
          </>
        )
      }
    </>
  )
}

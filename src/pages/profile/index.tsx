import { useRouter } from "next/router";
import { useEffect, useState, useMemo, FormEvent } from "react";
import moment from "moment";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { v4 as uuid } from 'uuid';

import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"

import { Info, InfoGroup } from "@/components/common/Info";
import { createPayment, getPayments, getUserInfo, removeReceipt } from "@/services/umobi/umobi.api";
import { UserInfo } from "@/services/umobi/models/UserInfo";
import { Topic } from "@/components/common/Topic";

import { useAuth } from "@/context/AuthContainer";
import { useApp } from "@/context/AppContext";

import { profileModule as styles } from '@/styles/pages';
import { Registration, RegistrationPayment } from "@/services/umobi/models/Registration";
import Image from "next/image";
import { FiFileText, FiPaperclip, FiPlus } from "react-icons/fi";
import { FORM_COMPLEX_FIELDS, PAYMENT_FIELDS } from "@/constants/FormFields";
import { FileContainer } from "@/styles/pages/Payments";
import Input from "@/components/common/Input";
import { Button, ButtonRemove } from "@/components/common/Button";
import { Radio } from "@/components/common/Radio";
import { CampDetails } from "@/components/common/CampDetails";
import { toMoney } from "@/helper/utils";
import { toast } from "react-toastify";
import { useEmail } from "@/context/EmailProvider";
import { PaymentForm } from "@/components/pages/paymentForm";

const INITIAL_STATE_PAYMENT: RegistrationPayment = {
  paymentMode: 'pix',
  registrationId: '',
  tax: 200
};

export default function Profile() {
  const auth = useAuth();
  const app = useApp();
  const history = useRouter();
  const email = useEmail();

  const [selectedRegistration, setSelectedRegistration] = useState<Registration>();

  const [file, setFile] = useState<File>();
  const [payment, setPayment] = useState<RegistrationPayment>(INITIAL_STATE_PAYMENT);
  const [createNew, setCreateNew] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPayment>();
  const [userPayments, setUserPayments] = useState<RegistrationPayment[]>();

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

  }, [selectedRegistration?.id]);

  useEffect(() => {
    const value = payment.paymentMode === 'pix' ? 200 : payment.paymentMode === '2x' ? 100 : parseFloat((200 / 3).toFixed(2));
    changePaymentField(PAYMENT_FIELDS.tax.field.name, value);
  }, [payment.paymentMode]);

  //TODO: ajustar o component para enviar outro comprovante
  //TODO: ajustar a parte de gerar link publico para as imagens do firebase
  const isPaymentsPaid = useMemo(() => {
    const totalPaid = userPayments?.filter(f => !f.rejected)?.reduce((acc, item) => acc + item.tax, 0);

    return totalPaid != undefined && totalPaid >= selectedRegistration?.camp.tax!;
  }, [userPayments]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    createPayment(payment, file as File)
      .then(_ => {
        setSelectedPayment(undefined);
        setCreateNew(false);
        setFile(undefined);
        setPayment(INITIAL_STATE_PAYMENT);
        // email.sendRegistration({
        //   email: app.userInfo?.email!,
        //   name: app.userInfo?.name!,
        //   data: new Date().toLocaleString()
        // }).then(_ => {
        //   toast.success('Comprovante enviado com sucesso!');
        // }).catch(err => console.log(err));
      })
      .catch(err => {
        console.log('ERRR', err);
        toast.warn("Tivemos um problema ao enviar o comprovante, atualize a página.")
      })
      .finally(() => {
        app.setIsLoading(false);
      });
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

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={auth.loading || app.isLoading} /> :
        (
          <Layout>
            <Title title={`${app.userInfo.name.split(' ').slice(0, 2).join(' ')}`} />

            {app.userInfo !== undefined && (
              <div className={styles.personData}>
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
              <section className={styles.events}>
                <Topic title="Inscrições" />
                <ul>
                  {app.userInfo.registrations.map((evt, index) => (
                    <li key={index} onClick={() => setSelectedRegistration(evt)} className={evt.camp.name === selectedRegistration.camp.name ? styles.selected : ''}>
                      <Image src={'/empty-folder.png'} alt={evt.camp.name} objectFit='contain' width={120} height={140} />
                    </li>
                  ))}
                </ul>
                <span>{`${selectedRegistration !== undefined ? selectedRegistration.camp.name : 'Selecione uma inscrição'}`}</span>
              </section>
            )}

            {selectedRegistration !== undefined && (
              <section className={styles.payments}>
                <ul>
                  <Topic title="Comprovantes" />
                  {!isPaymentsPaid && (
                    <li key={uuid()} className={styles.new}>
                      <div className={styles.header} onClick={() => { setCreateNew(!createNew); }}>
                        <span>Enviar comprovante</span>

                        <FiPlus size={24} color={'var(--text)'} />
                      </div>
                      {createNew && !userPayments?.find(f => f.paymentMode === 'pix') && (
                        <div className={styles.body}>
                          <CampDetails />
                          <PaymentForm
                            file={file}
                            onFileChange={handleFile}
                            submit={handleSubmit}
                            onPaymentChange={changePaymentField}
                            payment={payment}
                          />
                        </div>
                      )}
                    </li>
                  )}
                  {userPayments?.map(item => (
                    <li key={item.id} className={`${selectedPayment?.id === item.id ? styles.selected : ''} ${item.rejected ? styles.rejected : ''}`}>
                      <div className={`${styles.item} ${item.validated ? styles.validated : ''}`} onClick={() => handleItem(item)}>
                        <div>
                          <FiFileText size={24} />
                          <span>{item.validated && !item.rejected ? 'Validado' : item.validated && item.rejected ? 'Rejeitado' : 'Aguardando validação'}</span>
                        </div>
                        <div>
                          <span className={styles.paymentData}>{moment(item.createdAt).utc().format('DD/MM/yyyy')}</span>
                          <span>{toMoney(`${item.tax}`)}</span>
                          <span>{item.paymentMode}</span>
                        </div>
                      </div>
                      {(selectedPayment && item.id === selectedPayment.id) && (
                        <section className={`${styles.selectedPayment} ${!selectedPayment.validated || !selectedPayment.rejected ? styles.infoPending : ''}`}>
                          {selectedPayment.validated && selectedPayment.rejected ? (
                            <>
                              <span>O comprovante foi rejeitado! Basta remover e enviar o comprovante correto.</span>
                              <span className={styles.reason}>{selectedPayment.reason}</span>
                              <ButtonRemove label="Remover" onClick={() => handleRemoveReceipt(selectedPayment.id!)} />
                            </>
                          ) : selectedPayment.validated && !selectedPayment.rejected ? (
                            <span>O comprovante já foi validado!</span>
                          ) : (
                            <span>Pendente de validação, em breve você receberá um e-mail com o novo status.</span>
                          )}
                        </section>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </Layout>
        )
      }
    </>
  )
}

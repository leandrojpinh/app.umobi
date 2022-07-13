import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FiFileText, FiPaperclip, FiPlus } from "react-icons/fi";
import moment from "moment";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { v4 as uuid } from 'uuid';
import { toast } from "react-toastify";

import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"

import { Info, InfoGroup } from "@/components/common/Info";
import { createPayment, getPendingPayments, getUserInfo, getUserPayments } from "@/services/umobi/umobi.api";
import { UserInfo } from "@/services/umobi/models/UserInfo";
import { Topic } from "@/components/common/Topic";
import { RegistrationForm, RegistrationPayment } from "@/services/umobi/models/Registration";

import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { FileContainer } from "@/styles/pages/Payments";
import { FORM_COMPLEX_FIELDS, PAYMENT_FIELDS } from "@/constants/FormFields";
import { CampDetails } from "@/components/common/CampDetails";
import { Radio } from "@/components/common/Radio";

import { useAuth } from "@/context/AuthContainer";
import { useApp } from "@/context/AppContext";
import { useEmail } from '@/context/EmailProvider';

import { getBooleanAnswer, toMoney } from "@/helper/utils";

import styles from '@/styles/pages/registration-info.module.scss';

export default function Login() {
  const INITIAL_STATE = {
    address: '',
    birthDate: moment().utc().format('DD/MM/yyyy'),
    email: '',
    name: '',
    parentNames: '',
    phoneNumber: ''
  } as UserInfo;

  const auth = useAuth();
  const app = useApp();
  const history = useRouter();
  const email = useEmail();

  const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_STATE);
  const [userForm, setUserForm] = useState<RegistrationForm>();
  const [userPayments, setUserPayments] = useState<RegistrationPayment[]>();
  const [selectedPayment, setSelectedPayment] = useState<RegistrationPayment>();
  const [file, setFile] = useState<File>();
  const [tax, setTax] = useState(225);
  const [paymentMode, setPaymentMode] = useState('pix');
  const [createNew, setCreateNew] = useState(false);
  const [realoadPayments, setReloadPayments] = useState(false);

  useEffect(() => {
    getUserInfo().then(res => {
      const userData = {
        ...res,
        birthDate: moment(res.birthDate).utc().format('DD/MM/yyyy')
      } as UserInfo;
      setUserInfo(userData);

      if (res.form) {
        setUserForm(res.form);
      }

      if (res.payments) {
        setUserPayments(res.payments);
      }
    }).catch(err => {
      console.log('ERRO', err);
      history.push('/');
    }).finally(() => {
      app.setIsLoading(false);
      auth.setLoadingPage(false);
    });
  }, []);

  useEffect(() => {
    getUserPayments().then(res => {
      setUserPayments(res);
    }).catch(err => {
      console.log('ERRO', err);
      toast.warn("Tivemos um problema ao listar seus comprovantes, atualize a página.")
    }).finally(() => {
      app.setIsLoading(false);
      auth.setLoadingPage(false);
      setReloadPayments(false);
    });


  }, [auth.user.isAuthenticated, realoadPayments]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    app.setIsLoading(true);

    const registrationPayment = {
      registrationId: userInfo?.registrationId,
      paymentMode: paymentMode,
      tax: tax,
    } as RegistrationPayment;
    console.log('RegistrationPayment', registrationPayment);
    createPayment(registrationPayment, file as File)
      .then(_ => {
        setSelectedPayment(undefined);
        setCreateNew(false);
        setFile(undefined);
        setTax(0);
        setPaymentMode('pix');
        email.sendRegistration({
          email: userInfo.email,
          name: userInfo.name,
          data: new Date().toLocaleString()
        }).then(_ => {
          toast.success('Comprovante enviado com sucesso!');
        }).catch(err => console.log(err));
      })
      .then(_ => getPendingPayments().then(count => email.sendNew(count)))
      .catch(err => console.log('ERRR', err))
      .finally(() => {
        app.setIsLoading(false);
        setReloadPayments(true);
      });
  }

  const handleFile = (fileSelected?: File) => {
    if (fileSelected) {
      setFile(fileSelected);
    }
  }

  const handleItem = (item: RegistrationPayment) => {
    selectedPayment ? setSelectedPayment(undefined) : setSelectedPayment(item);

    setCreateNew(false);
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={auth.loading || app.isLoading} /> :
        (
          <Layout>
            <Title
              title={`Bem-vindo, ${auth?.user?.name?.split(' ')[0]}`}
              subtitle="Aqui você irá acompanhar o status da sua inscrição." />

            <div className={styles.personData}>
              <InfoGroup>
                <Info label={'E-mail'} text={userInfo.email!} />
                <Info label={'Telefone'} text={userInfo.phoneNumber!} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Data de Nascimento'} text={moment(userInfo.birthDate).utc().format('DD/MM/yyyy')} />
                <Info label={'Nome dos pais'} text={userInfo.parentNames!} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Endereço'} text={userInfo.address!} />
                <Info label={'Igreja'} text={userForm?.churchName!} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Nome do Pastor'} text={userForm?.ministerName!} />
                <Info label={'Telefone do Pastor'} text={userForm?.ministerNumber!} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Pastor está ciente?'} text={getBooleanAnswer(userForm?.ministerApproval!)} />
                <Info label={'Sabe nadar?'} text={getBooleanAnswer(userForm?.canSwim!)} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Tem alguma alergia?'} text={getBooleanAnswer(userForm?.isAllergic!)} />
                <Info label={'Nome do remédio'} text={userForm?.medicineName || '-'} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'É crente em Jesus?'} text={getBooleanAnswer(userForm?.isBeliever!)} />
                <Info label={'Está comprometido com as regras?'} text={getBooleanAnswer(userForm?.isResponsable!)} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Informações adicionais'} text={userForm?.moreInformation!} />
              </InfoGroup>
            </div>

            <section className={styles.payments}>
              <ul>
                <Topic title="Comprovantes" />
                <li key={uuid()} className={styles.new}>
                  <div className={styles.header} onClick={() => setCreateNew(!createNew)}>
                    <span>Enviar comprovante</span>

                    <FiPlus size={24} color={'var(--text)'} />
                  </div>
                  {createNew && (
                    <div className={styles.body}>
                      <CampDetails />
                      <form onSubmit={handleSubmit} className={styles.validation}>
                        <div className={styles.paymentMode}>
                          <Radio
                            key={PAYMENT_FIELDS.paymentMode.id}
                            label={PAYMENT_FIELDS.paymentMode.field.label}
                            options={userPayments?.length ? PAYMENT_FIELDS.paymentMode.options.filter(f => f.value !== 'pix') : PAYMENT_FIELDS.paymentMode.options}
                            name={PAYMENT_FIELDS.paymentMode.field.name}
                            subLabel={PAYMENT_FIELDS.paymentMode.field.subLabel}
                            selected={paymentMode}
                            onChange={e => {
                              setPaymentMode(e.target.value);

                              const [pix, _, x2, x1] = PAYMENT_FIELDS.paymentMode.options;
                              if (!(userPayments?.length!) && e.target.value !== 'pix') {
                                setTax(70);
                              } else {
                                const preTax = e.target.value === pix.value ? 225 : e.target.value === x1.value ? 155 : e.target.value === x2.value ? 77.50 : 51.67;
                                setTax(preTax);
                              }
                            }}
                          />
                        </div>
                        <FileContainer>
                          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFile(e.target.files ? e.target.files[0] : undefined)} />

                          <div>
                            <FiPaperclip height={18} color={'var(--text)'} />
                            {!file ? <span>Selecione novo arquivo</span> : <span>{file.name}</span>}
                          </div>
                        </FileContainer>

                        <Input
                          className={styles.receipt}
                          key={FORM_COMPLEX_FIELDS.tax.id}
                          label={FORM_COMPLEX_FIELDS.tax.field.label}
                          name={FORM_COMPLEX_FIELDS.tax.field.name}
                          type={'text'}
                          value={tax}
                          disabled={true}
                        />

                        <Button type="submit" label="Enviar" disabled={!file || !tax} />
                      </form>
                    </div>
                  )}
                </li>
                {userPayments?.map(item => (
                  <li key={item.id} className={`${selectedPayment?.id === item.id ? styles.selected : ''} ${item.rejected ? styles.rejected : ''}`}>
                    <div className={`${styles.item} ${item.validated ? styles.validated : ''}`} onClick={() => handleItem(item)}>
                      <div>
                        <FiFileText size={24} />
                        <span>{item.validated && !item.rejected ? 'Validado' : item.validated && item.rejected ? 'Rejeitado' : 'Aguardando validação'}</span>
                      </div>
                      <div>
                        <span>{moment(item.createdAt).utc().format('DD/MM/yyyy')}</span>
                        <span>{toMoney(`${item.tax}`)}</span>
                        <span>{item.paymentMode}</span>
                      </div>
                    </div>
                    {(selectedPayment && item.id === selectedPayment.id) && (
                      <section className={`${styles.selectedPayment} ${!selectedPayment.validated || !selectedPayment.rejected ? styles.infoPending : ''}`}>
                        {selectedPayment.validated && selectedPayment.rejected ? (
                          <>
                            <span>O comprovante foi rejeitado! Reenvie o comprovante correto</span>
                            <span className={styles.reason}>{selectedPayment.reason}</span>
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
          </Layout>
        )
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { 'umobi.token': token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
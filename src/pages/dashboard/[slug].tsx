import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { FiCheck, FiClipboard, FiClock } from 'react-icons/fi';
import moment from "moment";

import { LayoutAdmin } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title";
import { Summary } from "@/components/pages/dashboard/Summary";
import { FormRole } from "@/constants/FormRules";
import { useApp } from "@/context/AppContext";

import styles from '@/styles/pages/dashboard.registration.module.scss';
import { Search } from "@/components/common/Search";
import { Info, InfoGroup } from "@/components/common/Info";
import { Back } from "@/components/common/Back";
import Image from "next/image";
import { Topic } from "@/components/common/Topic";
import Input from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContainer";

type PaymentProps = {
  id: string;
  url: string;
  tax: number;
  date: string;
  validated: boolean;
}

export default function DashboardRegistration() {
  const history = useRouter();
  const app = useApp();
  const auth = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<PaymentProps[]>();
  const [selectedPayment, setSelectedPayment] = useState<PaymentProps>();

  useEffect(() => {
    if (auth) {
      if (!auth.user.isAdmin) {
        history.push('/');
      }
    }
  }, [auth]);

  useEffect(() => {
    setPayments([
      {
        id: 'aasd',
        tax: 200,
        url: 'https://s2.glbimg.com/MuwOEtaJEdYPsYA-nQVTzpcIwZ0=/0x0:1280x720/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/D/z/m7N8kMTY2lmufRWt5L3w/whatsapp-image-2021-12-10-at-07.00.54.jpeg',
        validated: false,
        date: moment().format('DD/MM/yyyy')
      } as PaymentProps,
      {
        id: 'asdasd',
        tax: 250,
        url: 'https://s2.glbimg.com/MuwOEtaJEdYPsYA-nQVTzpcIwZ0=/0x0:1280x720/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/D/z/m7N8kMTY2lmufRWt5L3w/whatsapp-image-2021-12-10-at-07.00.54.jpeg',
        validated: true,
        date: moment().format('DD/MM/yyyy')
      } as PaymentProps
    ])
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  }

  const handleSelectPayment = (obj: PaymentProps) => {
    setSelectedPayment(obj);
  }

  return (
    <>
      {app.isLoading || auth.loading ? <Loader loading={app.isLoading} /> :
        <LayoutAdmin>
          <Back />
          <Title title={`FULANO DE TAL`} />

          <div className={styles.container}>
            <section className={styles.side}>
              <InfoGroup>
                <Info label={'E-mail'} text={'asbdbasdhbashbd@asndajnsd.com'} />
                <Info label={'Telefone'} text={'(99) 99999-9999'} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Data de Nascimento'} text={'14/11/1996'} />
                <Info label={'Nome dos pais'} text={'asdbahsbd asduaysgdas'} />
              </InfoGroup>
              <InfoGroup>
                <Info label={'Endereço'} text={'asdasdasd asdasdas'} />
              </InfoGroup>

              <ul>
                {payments?.map(item => (
                  <li key={item.id} className={`${item.validated ? styles.validated : ''} ${selectedPayment?.id === item.id ? styles.selected : ''}`} onClick={() => handleSelectPayment(item)}>
                    <img src={item.url} alt="comprovante" />
                    <div>
                      <span>{item.date}</span>
                      <span>{item.tax}</span>
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
                      <img src={selectedPayment.url} />

                      <div className={styles.info}>
                        {selectedPayment.validated ? (
                          <>
                            <span>O comprovante já foi validado!</span>
                            <FiCheck size={36} color={'var(--text)'} />
                          </>
                        ) : (
                          <>
                            <span>O valor do comprovante deve ser: {selectedPayment.tax}</span>
                            <FiClock size={36} color={'var(--text)'} />
                          </>
                        )}
                      </div>
                    </div>
                    {!selectedPayment.validated && (
                      <form action="" className={styles.validation}>
                        <Input name="confirmationTax" label="Qual o valor do comprovante?" />
                        <div>
                          <Button styleType='cancel' label="Tá errado"></Button>
                          <Button label="Validado"></Button>
                        </div>
                      </form>
                    )}
                  </>
                )
              }
            </section>
          </div>
        </LayoutAdmin>
      }
    </>
  )
}
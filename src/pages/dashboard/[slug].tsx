import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { FiCheck, FiClipboard } from 'react-icons/fi';

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

export default function DashboardRegistration() {
  const router = useRouter();
  const app = useApp();

  const [search, setSearch] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  }

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        <LayoutAdmin>
          <Back />
          <Title title={`FULANO DE TAL`} />

          <div className={styles.container}>
            <section className={styles.info}>
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
                <li>
                  <img src={'https://s2.glbimg.com/MuwOEtaJEdYPsYA-nQVTzpcIwZ0=/0x0:1280x720/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/D/z/m7N8kMTY2lmufRWt5L3w/whatsapp-image-2021-12-10-at-07.00.54.jpeg'} alt="comprovante" />
                  <div>
                    <span>19/06/2022</span>
                    <span>R$ 200,00</span>
                    <span>Validado</span>
                  </div>
                </li>
                <li>
                  <img src={'https://s2.glbimg.com/MuwOEtaJEdYPsYA-nQVTzpcIwZ0=/0x0:1280x720/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/D/z/m7N8kMTY2lmufRWt5L3w/whatsapp-image-2021-12-10-at-07.00.54.jpeg'} alt="comprovante" />
                  <span>R$ 200,00</span>
                </li>
                <li>
                  <img src={'https://s2.glbimg.com/MuwOEtaJEdYPsYA-nQVTzpcIwZ0=/0x0:1280x720/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2021/D/z/m7N8kMTY2lmufRWt5L3w/whatsapp-image-2021-12-10-at-07.00.54.jpeg'} alt="comprovante" />
                  <span>R$ 200,00</span>
                </li>
              </ul>
            </section>
            <section className={styles.selectedPayment}>

            </section>
          </div>
        </LayoutAdmin>
      }
    </>
  )
}
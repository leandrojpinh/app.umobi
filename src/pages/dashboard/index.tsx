import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { FiCheck, FiClipboard } from 'react-icons/fi';

import { LayoutAdmin } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title";
import { Summary } from "@/components/pages/dashboard/Summary";
import { FormRole } from "@/constants/FormRules";
import { useApp } from "@/context/AppContext";

import styles from '@/styles/pages/dashboard.module.scss';
import { Search } from "@/components/common/Search";

export default function Dashboard() {
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
          <Title title="Dashboard" />

          <Summary amountPayments={0} confirmed={0} pendingToComplete={0} pendingToConfirm={0} totalRegistrations={0} />

          <section className={styles.content}>
            <Search
              value={search}
              setSearch={setSearch}
              placeholder={'Buscar por nome'}
              searchAction={() => { }} />
            <ul className={styles.registrations}>
              <li key={'541654'}>
                <div className='userData'>
                  <span className='name'>{'leandro jackson pinheiro do nascimento'}</span>
                  {/* item.totalConfirmed */}
                  {true ? (
                    <span>{`Confirmado: R$ 225,00`}</span>
                  ) : (
                    <span>{`Aguardando confirmação: R$ 155,00`}</span>
                  )}
                </div>


                <div className={styles.action}>
                  {true ? (
                    <button className={styles.checkButton}
                      onClick={() => { }}>
                      <FiCheck height={24} />
                    </button>
                  ) : (
                    <button className={styles.viewButton}
                      onClick={() => { }}>
                      <FiClipboard height={24} />
                    </button>
                  )}
                </div>
              </li>
            </ul>
          </section>
        </LayoutAdmin>
      }
    </>
  )
}
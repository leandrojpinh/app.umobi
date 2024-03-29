import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiExternalLink } from 'react-icons/fi';

import { LayoutAdmin } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title";
import { Summary } from "@/components/pages/dashboard/Summary";
import { useApp } from "@/context/AppContext";

import { dashboardModule as styles } from '@/styles/pages';
import { Search } from "@/components/common/Search";
import { useAuth } from "@/context/AuthContainer";
import { getForms, getSummary } from "@/services/umobi/umobi.api";
import { DashboardForm } from "@/model/views/DashboardForm";
import { SummaryPayments } from "@/services/umobi/models/Registration";
import { toMoney } from "@/helper/utils";

export default function Dashboard() {
  const history = useRouter();
  const app = useApp();
  const auth = useAuth();

  const [search, setSearch] = useState('');
  const [forms, setForms] = useState<DashboardForm[]>();
  const [filteredForms, setFilteredForms] = useState<DashboardForm[]>();
  const [summary, setSummary] = useState<SummaryPayments>();

  useEffect(() => {
    if (auth) {
      if (auth.user.token) {
        getForms().then(response => {
          if (response.length > 0) {
            const ordered = response
              .sort((a, b) => {
                return a.totalConfirmed - b.totalConfirmed
              });
            setForms(ordered);
            setFilteredForms(ordered);
          }
        });

        getSummary().then(response => {
          setSummary(response);
        })
      }

      app.setIsLoading(false);
    }
  }, [auth, app]);

  const handleFormDetails = (registrationId: string) => {
    history.push(`/dashboard/details/${registrationId}`)
  }

  const handleFilteredForms = () => {
    if (search) {
      setFilteredForms(forms?.filter(x => x.name.toLocaleLowerCase().includes(search.toLowerCase())))
    } else {
      setFilteredForms(forms);
    }
  };

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        <LayoutAdmin title="Dashboard">
          <Title title="Dashboard" />

          <Summary
            received={summary?.received!}
            confirmed={summary?.confirmed!}
            uncompleted={summary?.uncompleted!}
            pending={summary?.pending!}
            registrations={summary?.registrations!} />

          <section className={styles.content}>
            <Search
              value={search}
              setSearch={setSearch}
              placeholder={'Buscar por nome'}
              searchAction={handleFilteredForms} />
            <div className={styles.legend}>
              <div>
                <div></div>
                <span>Aguardando confirmação</span>
              </div>
              <div>
                <div></div>
                <span>Confirmado</span>
              </div>
            </div>
            <ul className={styles.registrations}>
              {filteredForms?.map(form => (
                <li key={form.registrationId}>
                  <div className={styles.userData}>
                    <span className={styles.name}>{form.name}</span>
                    {form.totalConfirmed ? (
                      <span className={styles.status}>{`Confirmado: ${toMoney(`${form.totalConfirmed}`)}`}</span>
                    ) : (
                      <span className={styles.status}>{`Aguardando confirmação`}</span>
                    )}
                  </div>

                  <div className={styles.action}>
                    <button className={form.totalConfirmed ? styles.viewButton : styles.checkButton} onClick={() => handleFormDetails(form.registrationId)}>
                      <FiExternalLink />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </LayoutAdmin>
      }
    </>
  )
}
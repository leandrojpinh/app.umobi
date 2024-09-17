'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiExternalLink } from 'react-icons/fi';

import { getForms, getSummary } from "@/services/umobi/umobi.api";
import { DashboardForm } from "@/model/views/DashboardForm";
import { SummaryPayments } from "@/services/umobi/models/Registration";
import { toMoney } from "@/helper/utils";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { LayoutAdmin } from "@/components/ui/Layout";
import { Title } from "@/components/ui/Text";
import { Summary } from "@/components/pages/Summary";
import { Search } from "@/components/ui/Search";

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

          <section className={'font-app-text flex w-full flex-1 flex-col bg-app-black-light shadow-md rounded-md py-8 px-4'}>
            <Search
              value={search}
              setSearch={setSearch}
              placeholder={'Buscar por nome'}
              searchAction={handleFilteredForms} />
            <div className={'flex pt-4 pr-0 pb-0 mt-4 gap-4 md:hidden'}>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-app-primary-dark"></div>
                <span className="text-xs">Aguardando confirmação</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-app-primary-light"></div>
                <span className="text-xs">Confirmado</span>
              </div>
            </div>
            <ul className={'mt-8 grid-cols-1 gap-2 list-none text-app-text'}>
              {filteredForms?.map(form => (
                <li key={form.registrationId} className="flex py-2 px-4 border-b-[1px] border-solid border-app-placeholder items-center justify-between transition-all duration-200 my-0 -mx-4">
                  <div className={'flex justify-between flex-1 uppercase text-sm'}>
                    <span>{form.name}</span>
                    {form.totalConfirmed ? (
                      <span className={'hidden md:flex'}>{`Confirmado: ${toMoney(`${form.totalConfirmed}`)}`}</span>
                    ) : (
                      <span className={'hidden md:flex'}>{`Aguardando confirmação`}</span>
                    )}
                  </div>

                  <div className={'flex ml-4'}>
                    <button className={`text-app-text transition-all duration-200 border-none py-2 px-4 rounded-md shadow-md cursor-pointer ${form.totalConfirmed ? 'bg-app-primary-light' : 'bg-app-primary-dark'}`} onClick={() => handleFormDetails(form.registrationId)}>
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
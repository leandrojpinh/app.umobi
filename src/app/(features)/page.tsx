'use client'

import { Videos } from "@/components/pages/Videos";
import { Layout } from "@/components/ui/Layout";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { getCamps } from "@/services/umobi/umobi.api";
import Link from "next/link";
import Image from 'next/image';
import { ALink } from "@/components/ui/Button";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const auth = useAuth();
  const app = useApp();

  useEffect(() => {
    app.setIsLoading(true);
    getCamps().then(camps => {
      app.setEvents(camps);
    })
      .catch(_ => {
        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center pt-16 pb-8">
        <span className="text-app-primary-light font-app-text text-4xl">Olá,</span>
        <strong className="uppercase text-center text-4xl pt-4 px-0 pb-8 tracking-widest">Bem-vindo à plataforma de inscrições para os eventos da Umobi</strong>
        <span className="text-center font-app-text text-base text-app-text2">A plataforma visa facilitar as inscrições e agilizar o processo <br />para que fique de forma independente.</span>
      </div>
      {
        (auth.user.isAdmin || auth.user.isViewer) ? (
          <div className="justify-center py-8 flex">
            <ALink label={'Gerenciar as inscrições'} path={'/dashboard'} />
          </div>
        ) : (
          <>
            {(auth.user.isAuthenticated && app.hasAvailableEvents) ||
              ((!auth.user.isAuthenticated && app.events.length > 0)) && (
                <div className={'pt-20 pr-0 pb-0 flex flex-col w-full h-full'}>
                  <strong className="text-4xl text-center uppercase mb-8 tracking-widest">Eventos</strong>
                  <ul className="flex justify-center">
                    {app.events.map((event, index) => (
                      <Link key={event.id} href={'/registration'} className="flex no-underline cursor-pointer">
                        <li key={index} className="flex justify-center items-center transition-all duration-200 flex-col hover:brightness-90">
                          <picture>
                            <Image className="rounded-lg" src={!!event.folderUrl ? event.folderUrl : '/folder.svg'} alt={event.name} objectPosition={'center'} objectFit='cover' width={295} height={344} />
                          </picture>
                          {/* <div className={styles.eventInfo}>
                              <span>Inscrições encerradas</span>
                            </div> */}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
          </>
        )
      }
      <Videos />
    </Layout>
  );
}

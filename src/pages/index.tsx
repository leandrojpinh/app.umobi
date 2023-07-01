import React, { useEffect } from 'react';

import styles from '@/styles/index.module.scss';
import { ALink } from '@/components/common/Button';
import { Layout } from '@/components/common/Layout';
import { useAuth } from '@/context/AuthContainer';
import ReactPlayer from 'react-player';
import { RESOURCES } from '@/constants/Resources';

import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getCamps } from '@/services/umobi/umobi.api';
import { toast } from 'react-toastify';

export const metadata = {
  title: 'Sling Academy',
  description:
    'This is a meta description. Welcome to slingacademy.com. Happy coding and have a nice day',
};

export default function Home() {
  const auth = useAuth();
  const app = useApp();

  useEffect(() => {
    app.setIsLoading(true);
    getCamps().then(camps => {
      app.setEvents(camps);
    })
      .catch(err => {
        console.log('ERROR-137', err);

        toast.error('Houve um problema na comunicação, tenta novamente. Se o problema persistir, fala com alguém da Secretaria da Umobi.');
      }).finally(() => {
        app.setIsLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <span className={styles.hello}>Olá,</span>
        <strong className={styles.title}>Bem-vindo à plataforma de inscrições para os eventos da Umobi</strong>
        <span className={styles.subtitle}>A plataforma visa facilitar as inscrições e agilizar o processo para <br />que fique de forma independente.</span>

        {
          (auth.user.isAdmin || auth.user.isViewer) ? (
            <ALink label={'Gerenciar as inscrições'} path={'/dashboard'} />
          ) : (
            <>
              {(auth.user.isAuthenticated && app.hasAvailableEvents) ||
                ((!auth.user.isAuthenticated && app.events.length > 0)) && (
                  <div className={styles.events}>
                    <strong>Eventos</strong>
                    <ul>
                      {app.events.map(event => (
                        <Link key={event.id} href={'/registration'}>
                          <li>
                            <picture>
                              <Image src={event.folderUrl ?? '/folder.svg'} alt={event.name} objectPosition={'center'} objectFit='cover' width={120} height={140} />
                            </picture>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                )}
            </>
          )
        }

        <div className={styles.last}>
          <strong>Retiro Umobi 2022</strong>
          <div>
            {/* <ReactPlayer url={RESOURCES.video} /> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}
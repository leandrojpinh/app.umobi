import React from 'react';

import styles from '@/styles/index.module.scss';
import { ALink } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/common/Loader';
import { Layout } from '@/components/common/Layout';
import { useAuth } from '@/context/AuthContainer';
import ReactPlayer from 'react-player';

export default function Home() {
  const app = useApp();
  const auth = useAuth();

  return (
    <>
      {app.isLoading ? <Loader loading={app.isLoading} /> :
        (
          <Layout>
            <div className={styles.container}>
              <span className={styles.hello}>Olá,</span>
              <strong className={styles.title}>Bem-vindo à plataforma de<br /> inscrições para os Retiros da <br />Umobi</strong>
              <span className={styles.subtitle}>A plataforma visa facilitar as inscrições e agilizar o processo para <br />que fique de forma independente.</span>

              <ALink label={auth?.user?.isAuthenticated ? 'Acompanhar minha inscrição' : 'Quero me inscrever'} path={auth?.user?.isAuthenticated ? '/registration-info' : '/registration'} />

              <div className={styles.last}>
                <strong>Retiro Umobi 2021</strong>
                <div>
                  <ReactPlayer url={process.env.NEXT_PUBLIC_YOUTUBE_PLAYER} />
                </div>
              </div>
            </div>
          </Layout>
        )}
    </>
  )
}
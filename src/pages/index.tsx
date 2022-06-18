import React, { useEffect } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

import styles from '@/styles/index.module.scss';
import { ALink } from '@/components/common/Button';
import { useApp } from '@/context/AppContext';
import { Loader } from '@/components/common/Loader';
import { Layout } from '@/components/common/Layout';
import { useAuth } from '@/context/AuthContainer';

export default function Home() {
  const app = useApp();
  const auth = useAuth();

  const onPlayerReady: YouTubeProps['onReady'] = (e) => {
    e.target.pauseVideo();
  }

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

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
                <YouTube
                  videoId='wV3TQjDUdW0'
                  opts={opts}
                  onReady={onPlayerReady} />
              </div>
            </div>
          </Layout>
        )}
    </>
  )
}
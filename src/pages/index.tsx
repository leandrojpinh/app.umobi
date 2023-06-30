import React from 'react';

import styles from '@/styles/index.module.scss';
import { ALink } from '@/components/common/Button';
import { Layout } from '@/components/common/Layout';
import { useAuth } from '@/context/AuthContainer';
import ReactPlayer from 'react-player';
import { RESOURCES } from '@/constants/Resources';

import Image from 'next/image';
import Link from 'next/link';
import { Events } from '@/components/pages/event';

export default function Home() {
  const auth = useAuth();

  return (
    <Layout>
      <div className={styles.container}>
        <span className={styles.hello}>Olá,</span>
        <strong className={styles.title}>Bem-vindo à plataforma de<br /> inscrições para os Retiros da <br />Umobi</strong>
        <span className={styles.subtitle}>A plataforma visa facilitar as inscrições e agilizar o processo para <br />que fique de forma independente.</span>

        {
          (auth.user.isAdmin || auth.user.isViewer) ? (
            <ALink label={'Gerenciar as inscrições'} path={'/dashboard'} />
          ) : (
            <Events />
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
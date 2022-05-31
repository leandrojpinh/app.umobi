import React from 'react';

import styles from '@/styles/index.module.scss';

export default function Home() {

  return (
    <div className={styles.container} style={{ background: `url('./square.svg')`, backgroundRepeat: 'no-repeat' }}>
      <span className={styles.hello}>Olá,</span>
      <strong className={styles.title}>Bem-vindo à plataforma de<br /> inscrições para os Retiros da <br />Umobi</strong>
      <span className={styles.subtitle}>A plataforma visa facilitar as inscrições e agilizar o processo para <br />que fique de forma independente.</span>

      <button className={styles.subscribe}>Quero me inscrever</button>

      <div className={styles.last}>
        <strong>Retiro Umobi 2021</strong>
        <div></div>
      </div>
    </div>
  )
}
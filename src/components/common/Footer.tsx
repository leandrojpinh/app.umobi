/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { FiInstagram, FiFacebook, FiArrowUp } from "react-icons/fi";

import styles from '@/styles/footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.info}>
          <picture>
            <img src="/umobi-logo.png" alt="Umobi" height={42} width={128} />
          </picture>
          <span>© Todos os direitos reservados - {new Date().getFullYear()}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.goTop} onClick={() => { }}>
            <FiInstagram height={36} />
          </button>
          <button className={styles.goTop} onClick={() => { }}>
            <FiFacebook height={36} />
          </button>
          <button className={styles.goTop} onClick={() => { }}>
            <FiArrowUp height={36} />
          </button>
        </div>
      </div>
    </footer>
  )
}
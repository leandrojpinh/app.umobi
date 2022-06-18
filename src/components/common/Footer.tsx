/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { animateScroll as scroll } from "react-scroll";
import { FiInstagram, FiFacebook, FiArrowUp } from "react-icons/fi";

import styles from '@/styles/footer.module.scss';
import { RESOURCES } from '@/constants/Resources';

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
          <a className={styles.goTop} href={RESOURCES.instagram} target="_blank" rel="noreferrer">
            <FiInstagram height={36} />
          </a>
          <a className={styles.goTop} href={RESOURCES.facebook} target="_blank" rel="noreferrer">
            <FiFacebook height={36} />
          </a>
          <button className={styles.goTop} onClick={() => scroll.scrollToTop()}>
            <FiArrowUp height={36} />
          </button>
        </div>
      </div>
    </footer>
  )
}
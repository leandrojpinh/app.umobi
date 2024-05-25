/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { animateScroll as scroll } from "react-scroll";
import { FiInstagram, FiFacebook, FiArrowUp } from "react-icons/fi";

import { footerModule as styles }  from '@/styles/components/common';
import { RESOURCES } from '@/constants/Resources';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.info}>
          <picture>
            <Image src="/umobi-logo.png" alt="Umobi" height={42} width={128} objectFit='cover' />
          </picture>
        </div>
        <div className={styles.actions}>
          <div className={styles.social}>
            <Link href={RESOURCES.instagram} target="_blank" rel="noreferrer">
              <a target="_blank" rel="noreferrer">
                <FiInstagram height={36} />
              </a>
            </Link>
            <Link href={RESOURCES.facebook} target="_blank" rel="noreferrer">
              <a target="_blank" rel="noreferrer">
                <FiFacebook height={36} />
              </a>
            </Link>           
          </div>
          <button className={styles.noMargin} onClick={() => scroll.scrollToTop()}>
            <FiArrowUp height={36} />
          </button>
        </div>
        <span>© Todos os direitos reservados - {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
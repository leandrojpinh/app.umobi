import { layoutModule as styles } from '@/styles/components/common';
import square from '@/assets/square.svg';
import line from '@/assets/line-up.svg';
import Head from 'next/head';

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{`Umobi${title ? ` | ${title}` : ''}`}</title>
      </Head>
      <div className={styles.container} style={{ backgroundImage: `url('${square}'), url('${line}')` }}>
        <div className={styles.wrapper}>
          {children}
        </div>
      </div>
    </>
  )
}

export const LayoutAdmin = ({ children, title }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{`Umobi Admin${title ? ` | ${title}` : ''}`}</title>
      </Head>

      <div className={styles.containerAdmin} style={{ backgroundImage: `url('${square}'), url('${line}')` }}>
        <div className={styles.wrapperAdmin}>
          {children}
        </div>
      </div>
    </>
  )
}
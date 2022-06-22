import styles from '@/styles/layout.module.scss';

import square from '@/assets/square.svg';
import line from '@/assets/line-up.svg';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container} style={{ backgroundImage: `url('${square}'), url('${line}')`}}>
      <div className={styles.wrapper}>
        {children}
      </div>
    </div>
  )
}

export const LayoutAdmin = ({ children }: LayoutProps) => {
  return (
    <div className={styles.containerAdmin} style={{ backgroundImage: `url('${square}'), url('${line}')`}}>
      <div className={styles.wrapperAdmin}>
        {children}
      </div>
    </div>
  )
}
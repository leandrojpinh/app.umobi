import styles from '@/styles/layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container} style={{ backgroundImage: `url('./square.svg'), url('./line-up.svg')`}}>
      <div className={styles.wrapper}>
        {children}
      </div>
    </div>
  )
}
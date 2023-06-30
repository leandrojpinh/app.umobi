import { titleModule as styles }  from '@/styles/components/common';

interface TitleProps {
  title: string;
  subtitle?: string;
}

export const Title = ({ title, subtitle }: TitleProps) => {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {subtitle && <span>{subtitle}</span>}
    </div>
  )
}
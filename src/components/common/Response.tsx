import { ALink } from './Button';

import { responseModule as styles }  from '@/styles/components/pages';

export interface IResponseProps {
  title: string;
  message: string;
  type: 'success' | 'error'
}

export const Response = ({ title, message, type = 'success' }: IResponseProps) => {
  return (
    <div className={styles.container}>
      <h1 className={type === 'success' ? styles.success : styles.error}>{title}</h1>
      <span>{message}</span>

      <ALink path={'/profile'} label={'Entendi'} />
    </div>
  )
}
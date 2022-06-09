import { ALink } from './Button';

import styles from '@/styles/components/response.module.scss';

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

      <ALink path={'/'} label={'Entendi'} />
    </div>
  )
}
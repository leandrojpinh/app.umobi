import { ButtonHTMLAttributes } from "react";
import styles from '@/styles/button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
}
export function Button({ label, onClick, ...rest }: ButtonProps) {
  return (
    <button className={styles.button} {...rest}>
      {label}
    </button>
  )
}
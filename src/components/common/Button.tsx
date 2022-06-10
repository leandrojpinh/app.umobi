import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from '@/styles/button.module.scss';
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";

type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
}

type ILinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  path: string;
}

export function Button({ label, onClick, ...rest }: IButtonProps) {
  return (
    <button className={styles.button} {...rest}>
      {label}
    </button>
  )
}

export function ALink({ label, path, onClick, ...rest }: ILinkProps) {
  return (
    <Link href={path}>
      <a className={styles.button} {...rest}>
        {label}
      </a>
    </Link>
  )
}

export function LoginButton({ label, onClick, ...rest }: IButtonProps) {
  return (
    <button className={styles.loginButton} {...rest}>
      {label}

      <FiLogIn size={24} color={'var(--text)'} />
    </button>
  )
}
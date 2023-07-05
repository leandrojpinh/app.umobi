import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { buttonModule as styles }  from '@/styles/components/common';
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";

type IButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  styleType?: 'ok' | 'cancel'
}

type ILinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string;
  path: string;
  children?: ReactNode;
}

export function Button({ label, onClick, styleType = 'ok', ...rest }: IButtonProps) {
  return (
    <button className={`${styles.button} ${styleType === 'cancel' ? styles.cancel : ''}`} onClick={onClick} {...rest}>
      {label}
    </button>
  )
}

export function ButtonRemove({ label, onClick, styleType = 'ok', ...rest }: IButtonProps) {
  return (
    <button className={`${styles.buttonRemove} ${styleType === 'cancel' ? styles.cancel : ''}`} onClick={onClick} {...rest}>
      {label}
    </button>
  )
}

export function ALink({ label, path, onClick, children, ...rest }: ILinkProps) {
  return (
    <Link href={path}>
      <a className={`${styles.button} ${rest.className ?? ''}`} {...rest}>
        {label ? label : children}
      </a>
    </Link>
  )
}

export function SignInButton({ label, onClick, ...rest }: IButtonProps) {
  return (
    <button className={styles.loginButton} {...rest}>
      {label}

      <FiLogIn size={24} color={'var(--text)'} />
    </button>
  )
}
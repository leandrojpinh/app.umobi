import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { FiArrowLeft, FiLogIn } from "react-icons/fi";
import { Title } from "../Text";
import { useRouter } from "next/navigation";

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
    <button className={`app-button border-solid border-[1px] border-app-black-dark text-app-text py-4 px-12 rounded-md cursor-pointer my-4 mx-0 ease-in-out duration-200 hover:brightness-90 ${styleType === 'cancel' ? 'bg-app-black-light' : ''}`} onClick={onClick} {...rest}>
      {label}
    </button>
  )
}

export function ButtonRemove({ label, onClick, styleType = 'ok', ...rest }: IButtonProps) {
  return (
    <button className={`bg-app-error border-solid border-[1px] border-app-black-dark text-app-text py-4 px-12 rounded-md cursor-pointer my-4 mx-0 ease-in-out duration-200 hover:brightness-90 ${styleType === 'cancel' ? 'bg-app-black-light' : ''}`} onClick={onClick} {...rest}>
      {label}
    </button>
  )
}

export function ALink({ label, path, onClick, children, ...rest }: ILinkProps) {
  return (
    <Link href={path}>
      <span className={`app-button border-solid border-[1px] border-app-black-dark text-app-text py-4 px-12 rounded-md cursor-pointer my-4 mx-0 ease-in-out duration-200 hover:brightness-90 ${rest.className ?? ''}`} {...rest}>
        {label ? label : children}
      </span>
    </Link>
  )
}

export function SignInButton({ label, onClick, ...rest }: IButtonProps) {
  return (
    <button className={'app-button border-solid font-normal tracking-widest border-[1px] border-app-black-dark text-app-text p-4 rounded-md cursor-pointer my-4 mt-2 mx-0 ease-in-out duration-200 hover:brightness-90 flex items-center justify-between w-full'} {...rest}>
      {label}
      <FiLogIn size={18} color={'var(--text)'} />
    </button>
  )
}

type BackProps = {
  onClick?: () => void;
}
export const Back = (props: BackProps) => {
  const history = useRouter();

  return (
    <button className={'flex items-center bg-[transparent] border-none mb-8 text-app-text cursor-pointer transition-all duration-200 hover:brightness-90'} onClick={() => {
      if (props.onClick != undefined) props.onClick();
      else history.back()
    }}>
      <FiArrowLeft size={18} color={'var(--text)'} />
      <span className="ml-2">Voltar</span>
    </button>
  )
}
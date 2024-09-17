import { InputHTMLAttributes } from "react";
import InputMask from 'react-input-mask';
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label: string;
  mask?: string;
}
export const Input: React.FC<InputProps> = ({ label, name, mask, ...rest }) => {
  return (
    <div className={`relative mb-4 ${rest.className}`}>
      <label className="text-sm font-app-text tracking-wider" htmlFor={name}>{label}</label>
      {mask ? (
        <InputMask className="w-full font-app-text mt-2 rounded-md bg-[transparent] border-[1px] border-solid border-app-text outline-0 p-2 tracking-wider text-base text-app-text" mask={mask} id={name} {...rest} />
      ) : (
        <input id={name} className="w-full font-app-text mt-2 rounded-md bg-[transparent] border-[1px] border-solid border-app-text outline-0 tracking-wider p-2 text-base text-app-text" {...rest} />
      )}
    </div>
  )
}

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label: string;
  isVisible?: boolean;
  setIsVisible: () => void;
}
export const Password: React.FC<InputPasswordProps> = ({ label, name, isVisible, setIsVisible, ...rest }) => {
  return (
    <div className={`relative mb-4 ${rest.className}`}>
      <label className="text-sm font-app-text tracking-wider" htmlFor={name}>{label}</label>
      <input className="w-full font-app-text mt-2 tracking-wider rounded-md bg-[transparent] border-[1px] border-solid border-app-text outline-0 p-2 text-base text-app-text" id={name} {...rest} />
      <button
        type='button'
        className={'absolute cursor-pointer border-none px-3 py-2 top-8 right-0 bg-[transparent] text-app-text'}
        onClick={setIsVisible}
      >
        {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  )
}

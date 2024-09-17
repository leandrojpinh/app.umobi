import { InputHTMLAttributes } from "react";

type UInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}

type CheckboxProps = UInputProps & {
  label: string;
}
export function Checkbox({ label, ...rest }: CheckboxProps) {
  return (
    <div className={'flex flex-1 my-8 mr-0 mb-4'}>
      <label className={'flex items-center relative h-8 pl-12 cursor-pointer font-medium text-app-primary-light tracking-widest'}>
        <span>{label}</span>
        <input className="absolute opacity-0 cursor-pointer h-0 w-0" type="checkbox" {...rest} />
        <span className={`absolute top-0 left-0 h-8 w-8 border-solid border-[1px] border-app-text transition-all duration-200 ${rest.checked ? 'bg-app-primary-light' : ''} hover:border-app-primary-light`}></span>
      </label>
    </div>
  )
}
import { InputHTMLAttributes } from "react";

type IOptionProps = {
  label: string;
  value: number | string;
}

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  subLabel?: string;
  options: IOptionProps[];
  key: string;
  selected: number | string;
}

export function Radio({ label, options, subLabel, selected, ...rest }: RadioProps) {
  return (
    <div key={rest.key} className={'flex flex-col flex-1 mt-4 mr-0 mb-6'}>
      <span className="font-app-text">{label}</span>
      {subLabel && <span className={'text-xs m-0 mt-1 font-app-text'}>{subLabel}</span>}
      <div className={'mt-4 flex gap-4 flex-col'}>
        {options.map((item, index) => (
          <label key={index} className={'block relative pl-9 cursor-pointer'}>
            <span className="font-app-text">{item.label}</span>
            <input className="absolute opacity-0 cursor-pointer" type="radio" value={item.value} {...rest} checked={selected === item.value} />
            <span className={`absolute top-0 left-0 h-6 w-6 border-solid border-[1px] border-app-text rounded-md transition-all duration-150 ${selected === item.value ? 'bg-app-primary-light' : ''} `}></span>
          </label>
        ))}
      </div>
    </div >
  )
}
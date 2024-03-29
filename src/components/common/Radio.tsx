import { InputHTMLAttributes } from "react";
import { radioModule as styles }  from '@/styles/components/common';

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
    <div key={rest.key} className={styles.inputBlock}>
      <span>{label}</span>
      {subLabel && <span className={styles.subLabel}>{subLabel}</span>}
      <div className={styles.wrapper}>
        {options.map((item, index) => (
          <label key={index} className={styles.container}>
            <span>{item.label}</span>
            <input type="radio" value={item.value} {...rest} checked={selected === item.value} />
            <span className={styles.checkmark}></span>
          </label>
        ))}
      </div>
    </div >
  )
}
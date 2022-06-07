import { InputHTMLAttributes } from "react";
import styles from '@/styles/radio.module.scss';

type IOptionProps = {
  label: string;
  value: number;
}

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  subLabel?: string;
  options: IOptionProps[];
  key: number;
}

export function Radio({ label, options, subLabel, ...rest }: RadioProps) {
  return (
    <div key={rest.key} className={styles.inputBlock}>
      <span>{label}</span>
      <div className={styles.wrapper}>
        {options.map(item => (
          <label className={styles.container}>
            <span>{item.label}</span>
            <input type="radio" value={item.value} {...rest} />
            <span className={styles.checkmark}></span>
          </label>
        ))}
      </div>
    </div >
  )
}
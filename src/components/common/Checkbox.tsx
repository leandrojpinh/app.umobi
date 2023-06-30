import { InputHTMLAttributes } from "react";
import { checkboxModule as styles }  from '@/styles/components/common';

type UInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}

type CheckboxProps = UInputProps & {
  label: string;
}
export function Checkbox({ label, ...rest }: CheckboxProps) {
  return (
    <div className={styles.inputBlock}>
      <label className={styles.container}>
        <span>{label}</span>
        <input type="checkbox" {...rest} />
        <span className={styles.checkmark}></span>
      </label>
    </div>
  )
}
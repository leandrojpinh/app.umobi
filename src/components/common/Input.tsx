import React, { InputHTMLAttributes } from 'react'
import styles from '@/styles/input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  name: string;
  label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...rest }) => {
  return (
    <div className={styles.inputBlock}>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} {...rest} />
    </div>
  )
}

export default Input;
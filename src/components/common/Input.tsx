import React, { InputHTMLAttributes } from 'react';
import InputMask from 'react-input-mask';
import { FiEye, FiEyeOff } from "react-icons/fi";

import { inputModule as styles } from '@/styles/components/common';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label: string;
  mask?: string;
}

export const Input: React.FC<InputProps> = ({ label, name, mask, ...rest }) => {
  return (
    <div className={`${styles.inputBlock} ${rest.className}`}>
      <label htmlFor={name}>{label}</label>
      {mask ? (
        <InputMask mask={mask} id={name} {...rest} crossOrigin='' />
      ) : (
        <input id={name} {...rest} />
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
    <div className={`${styles.inputBlock} ${rest.className}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...rest} />
      <button
        type='button'
        className={styles.inputPassword}
        onClick={setIsVisible}
      >
        {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  )
}

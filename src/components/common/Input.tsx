import React, { InputHTMLAttributes } from 'react';
import InputMask from 'react-input-mask';

import { inputModule as styles }  from '@/styles/components/common';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  label: string;
  mask?: string;
}

const Input: React.FC<InputProps> = ({ label, name, mask, ...rest }) => {
  return (
    <div className={`${styles.inputBlock} ${rest.className}`}>
      <label htmlFor={name}>{label}</label>
      {mask ? (
        <InputMask mask={mask} id={name} {...rest} />
      ) : (
        <input id={name} {...rest} />
      )}
    </div>
  )
}

export default Input;
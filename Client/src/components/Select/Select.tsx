import React from 'react';

import styles from './Select.module.sass';

interface Props {
  placeholder: string;
  value: string;
  handleChange: Function;
  disabled?: boolean;
}

export const Select: React.FC<Props> = (props) => {
  const { placeholder, children, value, handleChange, disabled } = props;

  return (
    <div className={styles.container}>
      <select
        className={styles.select}
        disabled={disabled}
        value={value}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
    </div>
  );
};

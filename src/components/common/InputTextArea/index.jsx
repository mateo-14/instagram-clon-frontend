import classNames from 'classnames';
import { forwardRef } from 'react';
import styles from './InputTextArea.module.css';

const InputTextArea = forwardRef(
  ({ placeholder, value, onChange, className, name, id, disabled }, ref) => (
    <textarea
      className={classNames(styles.textarea, className)}
      placeholder={placeholder}
      onChange={onChange}
      ref={ref}
      value={value}
      name={name}
      id={id}
      disabled={disabled}
    ></textarea>
  )
);

InputTextArea.displayName = 'InputTextArea';

export default InputTextArea;

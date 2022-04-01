import classNames from 'classnames';
import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * @type React.ForwardRefRenderFunction<React.FunctionComponent, InputPropTypes>
 */
const Input = forwardRef(({ masked, placeholder, value, onChange, className, name, id }, ref) => (
  <input
    className={classNames(styles.input, className)}
    placeholder={placeholder}
    onChange={onChange}
    ref={ref}
    value={value}
    type={masked ? 'password' : 'text'}
    name={name}
    id={id}
  ></input>
));

export default Input;

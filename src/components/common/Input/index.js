import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * @type React.ForwardRefRenderFunction<React.FunctionComponent, InputPropTypes>
 */
const Input = forwardRef(({ masked, placeholder, value, onChange, className, name }, ref) => (
  <input
    className={`${styles.input} ${className ? className : ''}`}
    placeholder={placeholder}
    onChange={onChange}
    ref={ref}
    value={value}
    type={masked ? 'password' : 'text'}
    name={name}
  ></input>
));

const InputPropTypes = {
  masked: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string
};
Input.propTypes = InputPropTypes;
Input.displayName = 'Input';

export default Input;

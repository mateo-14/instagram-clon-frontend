import styles from './Button.module.css';

const Button = ({ children, className, onClick, disabled = false }) => (
  <button
    className={`${styles.button} ${className ? className : ''}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;

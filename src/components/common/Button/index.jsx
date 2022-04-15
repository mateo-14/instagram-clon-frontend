import styles from './Button.module.css';

const Button = ({ children, className, onClick, disabled = false, type, style = 'solid' }) => (
  <button
    className={`${styles.button} ${styles[style]} ${className ? className : ''}`}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);

export default Button;

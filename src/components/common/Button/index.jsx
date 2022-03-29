import styles from './Button.module.css';

const Button = ({ children, className, onClick, disabled = false, type = 'solid' }) => (
  <button
    className={`${styles.button} ${styles[type]} ${className ? className : ''}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;

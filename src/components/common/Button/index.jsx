import { Link } from 'react-router-dom';
import styles from './Button.module.css';

function Button({
  children,
  className,
  onClick,
  disabled = false,
  type,
  style = 'solid',
  asLink = false,
  to,
}) {
  const commonProps = {
    className: `${styles.button} ${styles[style]} ${className ? className : ''}`,
    disabled: disabled,
    onClick: onClick,
  };

  if (asLink)
    return (
      <Link {...commonProps} to={to}>
        {children}
      </Link>
    );

  return (
    <button {...commonProps} type={type}>
      {children}
    </button>
  );
}

export default Button;

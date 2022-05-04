import { Link } from 'react-router-dom';
import styles from './Button.module.css';

function Button({
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
  style = 'solid',
  asLink = false,
  linkState,
  to,
}) {
  const commonProps = {
    className: `${styles.button} ${styles[style]} ${className ? className : ''}`,
    disabled: disabled,
    onClick: onClick,
  };

  if (asLink)
    return (
      <Link {...commonProps} to={to} state={linkState}>
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

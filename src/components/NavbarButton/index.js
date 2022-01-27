import styles from './NavbarButton.module.css';

const NavbarButton = ({ children, onClick, className }) => (
  <button className={`${styles.button} ${className ? className : ''}`} onClick={onClick}>
    {children}
  </button>
);

export default NavbarButton;

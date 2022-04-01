import Header from 'components/Header';
import styles from './Layout.module.css';

const Layout = ({ children }) => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>{children}</main>
  </div>
);

export default Layout;

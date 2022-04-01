import styles from './AuthPage.module.css';
import instagramLogo from '/instagram-logo.svg';

const Layout = ({ children }) => (
  <main className={styles.container}>
    <article className={styles.main}>{children}</article>
  </main>
);

const MainSection = ({ children }) => (
  <div className={styles.mainSection}>
    <header className={styles.header}>
      <div className={styles.logoWrapper} aria-label="Instagram logo">
        <img src={instagramLogo} alt="Instagram" />
      </div>
    </header>
    {children}
  </div>
);

const ExtraSection = ({ children }) => <div className={styles.extraSection}>{children}</div>;

const AuthPage = { Layout, MainSection, ExtraSection };
export default AuthPage;

import Head from 'next/head';
import Image from 'next/image';
import styles from './AuthPage.module.css';
import instagramLogo from '../../../public/instagram-logo.svg';

const Layout = ({ title, children }) => (
  <main className={styles.container}>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <article className={styles.main}>{children}</article>
  </main>
);

const MainSection = ({ children }) => (
  <div className={styles.mainSection}>
    <header className={styles.header}>
      <div className={styles.logoWrapper} aria-label="Instagram logo">
        <Image src={instagramLogo} alt="Instagram" layout="fill" />
      </div>
    </header>
    {children}
  </div>
);

const ExtraSection = ({ children }) => <div className={styles.extraSection}>{children}</div>;

const AuthPage = { Layout, MainSection, ExtraSection };
export default AuthPage;

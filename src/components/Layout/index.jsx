import Header from 'components/Header';
import { useEffect } from 'react';
import styles from './Layout.module.css';

export default function Layout({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

import Image from 'next/image'
import styles from './layout.module.css'

export default function AuthLayout ({ children, extra }: { children: React.ReactNode, extra: React.ReactNode }): JSX.Element | null {
  return (
      <main className={styles.container}>
        <article className={styles.main}>
          <div className={styles.mainSection}>
            <header className={styles.header}>
              <div className={styles.logoWrapper} aria-label="Instagram logo">
                <Image src="/instagram-logo.svg" alt="Instagram" width={170} height={48}></Image>
              </div>
            </header>
            {children}
          </div>
          {extra != null &&
            <div className={styles.extraSection}>{extra}</div>
          }
        </article>
      </main>
  )
}

/* const MainSection = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className={styles.mainSection}>
    <header className={styles.header}>
      <div className={styles.logoWrapper} aria-label="Instagram logo">
        <Image src="instagram-logo.svg" alt="Instagram"></Image>
      </div>s
    </header>
    {children}
  </div>
)

const ExtraSection = ({ children }: { children: React.ReactNode }): JSX.Element => <div className={styles.extraSection}>{children}</div>

const AuthPage = { Layout, MainSection, ExtraSection }
export default AuthPage
 */

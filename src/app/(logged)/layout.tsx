import Header from '@/components/Header'
import styles from './layout.module.css'

export default function RootLayout ({
  children,
  postModal
}: {
  children: React.ReactNode
  postModal: React.ReactNode
}): JSX.Element {
  return (
    <>
      <div className={styles.container} data-allow-change-by-modal>
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
      {postModal}</>
  )
}

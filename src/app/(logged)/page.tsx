import styles from './page.module.css'
import FeedPostsList from '@/components/feed/FeedPostsList'
import FeedAside from '@/components/feed/FeedAside'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InstagramClon'
}

export default function Home (): JSX.Element {
  return (
    <div className={styles.content}>
      <FeedPostsList />
      <FeedAside />
    </div>
  )
}

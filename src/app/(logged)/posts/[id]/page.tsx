import Post from '@/components/Post'
import styles from './posts.module.css'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loading...'
}

export interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage ({ params }: PostPageProps): JSX.Element {
  return <div className={styles.container}>
    <Post id={parseInt(params.id)} isInFeed={false} classes={{ container: styles.postContainer }}></Post>
  </div>
}

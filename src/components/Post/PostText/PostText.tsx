import Link from 'next/link'
import styles from './PostText.module.css'

interface PostTextProps {
  author: string
  text: string
}

const PostText: React.FC<PostTextProps> = ({ author, text }) => (
  <p className={styles.text}>
    <Link href={`/${author}`} className={styles.author} prefetch={false}>
      {`${author} `}
    </Link>
    {text}
  </p>
)

export default PostText

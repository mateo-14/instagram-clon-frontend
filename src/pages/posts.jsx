import Layout from 'components/Layout'
import PostComponent from 'components/Post'
import usePostsChangesListeners from 'hooks/usePostsChangesListeners'
import useTitle from 'hooks/useTitle'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { getPost } from 'services/postsService'
import styles from './posts.module.css'

export default function Posts() {
  usePostsChangesListeners()
  let { id } = useParams()
  id = parseInt(id)
  const { data, status } = useQuery(['posts', id], () => getPost(id), {
    enabled: !!id
  })

  useTitle(
    status === 'success' && data
      ? `${data?.author?.username} on InstagramClon: "${data?.text}" `
      : 'Loading...'
  )

  return (
    <Layout>
      <div className={styles.container}>
        {status === 'success' && <PostComponent data={data} isFullPost={true}></PostComponent>}
      </div>
    </Layout>
  )
}

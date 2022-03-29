import Layout from 'components/Layout';
import PostComponent from 'components/Post';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { getPost } from 'services/postsServices';
import styles from 'styles/posts.module.css';

export default function Posts() {
  let { id } = useParams();
  id = parseInt(id);
  const { data, status } = useQuery(['posts', id], () => getPost(id), {
    enabled: !!id,
  });

  return (
    <Layout
      title={
        status === 'success' && data
          ? `${data?.author?.username} on Instagram: "${data?.text}" `
          : 'Loading...'
      }
    >
      <div className={styles.container}>
        {status === 'success' && <PostComponent data={data} isFullPost={true}></PostComponent>}
      </div>
    </Layout>
  );
}

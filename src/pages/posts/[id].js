import Layout from 'components/Layout';
import PostComponent from 'components/Post';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getPost } from 'services/postsServices';
import styles from 'styles/post.module.css';

export default function Post() {
  const router = useRouter();
  const id = parseInt(router.query.id);
  const { data, status } = useQuery(['posts', id], () => getPost(id), {
    enabled: !!id,
  });

  return (
    <Layout>
      <div className={styles.container}>
        {status === 'success' && <PostComponent post={data} isFullPost={true}></PostComponent>}
      </div>
    </Layout>
  );
}
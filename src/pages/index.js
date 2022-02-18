import Layout from 'components/Layout';
import styles from 'styles/index.module.css';
import { getFeed } from 'services/postsServices';
import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { queryClient } from './_app';
import Link from 'next/link';
import Post from 'components/Post';
import { useRouter } from 'next/router';
import Modal from 'components/common/Modal';

const fetchPosts = ({ pageParam }) => {
  return getFeed(pageParam);
};
export default function Home() {
  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    'posts/feed',
    fetchPosts,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      },
      onSuccess: (data) => {
        for (const page of data.pages) {
          for (const post of page) {
            if (!queryClient.getQueryData(['posts', post.id]))
              queryClient.setQueryData(['posts', post.id], post);
          }
        }
      },
    }
  );
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCommentAction = (postId) => {
    window.history.pushState(null, null, `/posts/${postId}`);
    setSelectedPost(postId);
    console.log(data.pages.flat());
  };

  const handlePostClose = () => {
    setSelectedPost(null);
    window.history.pushState(null, null, `/`);
  }

  return (
    <Layout>
      <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to load'}
      </button>
      <section className={styles.posts}>
        {status === 'success' &&
          data.pages.flat().map((post) => (
            <div key={post.id}>
              <Link href={`/posts/${post.id}`}>
                <a>Open</a>
              </Link>
              <Post post={post} key={post.id} onClickCommentAction={handleCommentAction} />
            </div>
          ))}
      </section>

      <Modal showCloseButton={true} show={!!selectedPost} className={styles.modalContainer} onClose={handlePostClose}>
          {selectedPost && (
          <Post
            post={data.pages.flat().find((post) => post.id === selectedPost)}
            inModal={true}
            isFullPost={true}
          />
        )}
      </Modal>
    </Layout>
  );
}

import Layout from 'components/Layout';
import Post from 'components/Post';
import PostModal from 'components/PostModal';
import usePostModal from 'hooks/usePostModal';
import usePostsQuerySetters from 'hooks/usePostsQuerySetters';
import useTitle from 'hooks/useTitle';
import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { getFeed } from 'services/postsServices';
import styles from 'styles/index.module.css';

function useFeedPosts() {
  const intersectionRef = useRef();

  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['posts', 'feed'],
    ({ pageParam }) => getFeed(pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      },
    }
  );

  useEffect(() => {
    if (status !== 'success' || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(intersectionRef.current);
    return () => observer.disconnect();
  }, [status, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return { posts: data?.pages?.flat(), status, isFetchingNextPage, intersectionRef };
}

export default function Home() {
  const { posts, intersectionRef } = useFeedPosts();
  const { handleCommentSuccess, handleLikeSuccess } = usePostsQuerySetters(['posts', 'feed']);
  const { selectedPost, handleRequestOpenModal, handlePostClose } = usePostModal(posts);
  useTitle(
    selectedPost
      ? `${selectedPost?.author?.username} on Instagram: "${selectedPost?.text}" `
      : 'Instagram'
  );

  return (
    <Layout>
      <section className={styles.posts}>
        {posts?.map((post) => (
          <Post
            data={post}
            key={post.id}
            onRequestOpenModal={handleRequestOpenModal}
            onLikeSuccess={handleLikeSuccess}
            onCommentSuccess={handleCommentSuccess}
          />
        ))}
      </section>
      <div ref={intersectionRef}></div>

      <PostModal
        post={selectedPost}
        onClose={handlePostClose}
        onCommentSuccess={handleCommentSuccess}
        onLikeSuccess={handleLikeSuccess}
      />
    </Layout>
  );
}

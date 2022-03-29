import Modal from 'components/common/Modal';
import Layout from 'components/Layout';
import Post from 'components/Post';
import useFeedPosts from 'hooks/useFeedPosts';
import { useEffect, useRef, useState } from 'react';
import styles from 'styles/index.module.css';

export default function Home() {
  const [selectedPost, setSelectedPost] = useState(null);
  const {
    posts,
    status,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    handleLikeSuccess,
    handleCommentSuccess,
  } = useFeedPosts();
  const intersectionRef = useRef();

  const handleRequestOpenModal = (post) => {
    window.history.pushState({ postId: post.id }, null, `/posts/${post.id}`);
    setSelectedPost(post);
  };

  const handlePostClose = () => {
    setSelectedPost(null);
    window.history.pushState(null, null, `/`);
  };

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

  useEffect(() => {
    window.onpopstate = (event) => {
      if (event.state?.postId)
        setSelectedPost(posts.find((post) => post.id === event.state.postId));
      else setSelectedPost(null);
    };
  }, [posts]);

  return (
    <Layout
      title={
        selectedPost
          ? `${selectedPost?.author?.username} on Instagram: "${selectedPost?.text}" `
          : 'Instagram'
      }
    >
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

      <Modal
        showCloseButton={true}
        show={!!selectedPost}
        className={styles.modalContainer}
        onClose={handlePostClose}
      >
        {selectedPost && (
          <Post
            data={selectedPost}
            isFullPost={true}
            onLikeSuccess={handleLikeSuccess}
            onCommentSuccess={handleCommentSuccess}
          />
        )}
      </Modal>
    </Layout>
  );
}

import ProfileImage from 'components/common/ProfileImage';
import Layout from 'components/Layout';
import Post from 'components/Post';
import PostModal from 'components/PostModal';
import useAuth from 'hooks/useAuth';
import usePostModal from 'hooks/usePostModal';
import usePostsQuerySetters from 'hooks/usePostsQuerySetters';
import useTitle from 'hooks/useTitle';
import { useInfiniteQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getFeed } from 'services/postsServices';
import useInfinityScroll from "services/useInfinityScroll";
import styles from 'styles/index.module.css';

function useFeedPosts() {
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

  const { targetRef } = useInfinityScroll({
    disabled: !hasNextPage || status !== 'success' || isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  return { posts: data?.pages?.flat(), status, isFetchingNextPage, targetRef };
}

export default function Home() {
  const { posts, targetRef } = useFeedPosts();
  const { data: loggedUser } = useAuth();
  const { handleCommentSuccess, handleLikeSuccess } = usePostsQuerySetters(['posts', 'feed']);
  const { openPost, close: closePost, open: openPostFunc } = usePostModal(posts);

  useTitle(
    openPost
      ? `${openPost?.author?.username} on InstagramClon: "${openPost?.text}" `
      : 'InstagramClon'
  );

  return (
    <Layout>
      <div className={styles.content}>
        <section className={styles.posts}>
          {posts?.map((post) => (
            <Post
              data={post}
              key={post.id}
              onRequestOpenModal={openPostFunc}
              onLikeSuccess={handleLikeSuccess}
              onCommentSuccess={handleCommentSuccess}
            />
          ))}
          <div ref={targetRef}></div>
        </section>

        <PostModal
          post={openPost}
          onClose={closePost}
          onCommentSuccess={handleCommentSuccess}
          onLikeSuccess={handleLikeSuccess}
        />
        <aside className={styles.aside}>
          <div className={styles.userCard}>
            <Link to={`/${loggedUser?.username}`}>
              <ProfileImage
                src={loggedUser?.profileImage}
                className={styles.profileImage}
              ></ProfileImage>
            </Link>
            <div>
              <Link to={`/${loggedUser?.username}`} className={styles.username}>
                {loggedUser?.username}
              </Link>
              {loggedUser?.displayName && (
                <span className={styles.displayName}>{loggedUser?.displayName}</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

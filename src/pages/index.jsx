import classNames from 'classnames';
import Button from 'components/common/Button';
import ProfileImage from 'components/common/ProfileImage';
import Layout from 'components/Layout';
import Post from 'components/Post';
import PostModal from 'components/PostModal';
import useAuth from 'hooks/useAuth';
import useFollowMutation from 'hooks/useFollowMutation';
import usePostModal from 'hooks/usePostModal';
import usePostsQuerySetters from 'hooks/usePostsQuerySetters';
import useTitle from 'hooks/useTitle';
import { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getFeed } from 'services/postsServices';
import useInfinityScroll from 'services/useInfinityScroll';
import { getSuggestedUsers } from 'services/usersService';
import styles from './index.module.css';

function useFeedPosts() {
  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['posts', 'feed'],
    ({ pageParam }) => getFeed(pageParam),
    {
      getNextPageParam: lastPage => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      }
    }
  );

  const { targetRef } = useInfinityScroll({
    disabled: !hasNextPage || status !== 'success' || isFetchingNextPage,
    onIntersect: fetchNextPage
  });

  return { posts: data?.pages?.flat(), status, isFetchingNextPage, targetRef };
}

export default function Home() {
  const { posts, targetRef } = useFeedPosts();
  const { data: loggedUser } = useAuth();
  const { handleCommentSuccess, handleLikeSuccess } = usePostsQuerySetters(['posts', 'feed']);
  const { openPost, close: closePost, open: openPostFunc } = usePostModal(posts);
  const { data: suggested } = useQuery(['users', 'suggested'], getSuggestedUsers);

  useTitle(
    openPost
      ? `${openPost?.author?.username} on InstagramClon: "${openPost?.text}" `
      : 'InstagramClon'
  );

  return (
    <Layout>
      <div className={styles.content}>
        <section className={styles.posts}>
          {posts?.map(post => (
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
          <section className={styles.userCard}>
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
          </section>
          <section className={styles.suggestedUsers}>
            <h2 className={styles.suggestedUsersText}>Suggestions For You</h2>
            <ul className={styles.suggestedUsers}>
              {suggested?.map(user => (
                <SuggestedUser user={user} />
              ))}
            </ul>
          </section>
          <section className={styles.infoText}>
            <p>
              <a href="https://app.swaggerhub.com/apis-docs/mateo-14/instagram-clone_api/1.0" target="_blank">API</a> .{' '}
              <a href="https://github.com/mateo-14/instagram-clon-frontend" target="_blank">Frontend Repo</a> .{' '}
              <a href="https://github.com/mateo-14/instagram-clon-backend" target="_blank">Backend Repo</a>
            </p>
            <p>
              Made by <a href="https://mateoledesma.vercel.app" target="_blank" className={styles.authorLink}>Mateo Ledesma</a>
            </p>
          </section>
        </aside>
      </div>
    </Layout>
  );
}

function SuggestedUser({ user }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const followMutation = useFollowMutation({
    onSuccess: () => {
      setIsFollowing(!isFollowing);
    }
  });

  return (
    <li className={classNames(styles.userCard, styles.suggestedUserCard)} key={user.id}>
      <Link to={`/${user.username}`}>
        <ProfileImage
          src={user.profileImage}
          className={styles.suggestedUserProfileImage}
        ></ProfileImage>
      </Link>
      <div>
        <Link to={`/${user.username}`} className={styles.username}>
          {user.username}
        </Link>
        {user.displayName && <span className={styles.displayName}>{user.displayName}</span>}
      </div>
      <Button
        style="text"
        className={styles.suggestedFollowBtn}
        disabled={followMutation.isLoading}
        onClick={() =>
          followMutation.mutate({
            userId: user.id
          })
        }
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </li>
  );
}

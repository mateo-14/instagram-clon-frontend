import Button from 'components/common/Button';
import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import ProfileImage from 'components/common/ProfileImage';
import Layout from 'components/Layout';
import PostModal from 'components/PostModal';
import useAuth from 'hooks/useAuth';
import usePostModal from 'hooks/usePostModal';
import usePostsQuerySetters from 'hooks/usePostsQuerySetters';
import useTitle from 'hooks/useTitle';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { getUserPosts } from "services/postsServices";
import useInfinityScroll from 'services/useInfinityScroll';
import { followUser, getUserByUsername, unfollowUser } from 'services/usersService';
import styles from './profile.module.css';

function useProfilePosts(id) {
  const { data, status, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['users', id, 'posts'],
    ({ pageParam }) => getUserPosts(id, pageParam),
    {
      enabled: !!id,
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

function useProfile(username) {
  const refetchOn = ({ state }) => !(state.error?.status === 404);

  const { data, error, refetch } = useQuery(
    ['users', username],
    () => getUserByUsername(username),
    {
      enabled: !!username,
      retry: false,
      refetchOnMount: refetchOn,
      refetchOnReconnect: refetchOn,
    }
  );

  const displayName = data?.displayName || data?.username;
  const title = data
    ? `${displayName} (@${data.username}) - InstagramClon photos`
    : error
    ? error.status === 404
      ? 'Page Not Found - InstagramClon'
      : 'An error has ocurred - InstagramClon'
    : 'Loading... - InstagramClon';

  const followMutation = useMutation(
    async () => {
      if (data.followedByClient) await unfollowUser(data.id);
      else await followUser(data.id);
    },
    { onSuccess: refetch }
  );

  return { error, title, followMutation, data: data ? { ...data, displayName } : null };
}

export default function Profile() {
  const { data: client } = useAuth(false);
  const { username } = useParams();
  const { title, error, data, followMutation } = useProfile(username);
  useTitle(title);
  const { posts, targetRef } = useProfilePosts(data?.id);
  const { handleCommentSuccess, handleLikeSuccess } = usePostsQuerySetters([
    'users',
    data?.id,
    'posts',
  ]);
  const { close: closePost, open: openPostFunc, openPost } = usePostModal(posts);

  const handlePostClick = (e, post) => {
    e.preventDefault();
    openPostFunc(post);
  };

  return (
    <Layout>
      {error?.status === 404 && (
        <div>
          <h1>{`Sorry, this page isn't available.`}</h1>
          <p>
            The link you followed may be broken, or the page may have been removed. Go back to
            Instagram.
          </p>
        </div>
      )}

      {data && (
        <div>
          <section className={styles.profileInfo}>
            {/* <div className={styles.imageContainer}> */}
            <ProfileImage src={data.profileImage} className={styles.image}></ProfileImage>
            {/* </div> */}
            <div className={styles.mainInfo}>
              <h2 className={styles.username}>{data.username}</h2>
              {client?.id === data?.id ? (
                <Button asLink={true} to={'/accounts/edit'}>
                  Edit Profile
                </Button>
              ) : (
                /* Follow button */
                <Button onClick={() => followMutation.mutate()} disabled={followMutation.isLoading}>
                  {data.followedByClient ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
            <div className={styles.displayNameBio}>
              <p className={styles.displayName}>{data.displayName}</p>
              {data.bio && <p className={styles.bio}>{data.bio}</p>}
            </div>
            <ul className={styles.userInfoCount}>
              <li>
                <span className={styles.infoNumber}>{data._count.posts}</span> posts
              </li>
              <li>
                <span className={styles.infoNumber}>{data._count.followedBy}</span> followers
              </li>
              <li>
                <span className={styles.infoNumber}>{data._count.following}</span> following
              </li>
            </ul>
          </section>
          <section className={styles.posts}>
            {posts?.map((post) => (
              <a href={`/posts/${post.id}`} key={post.id} onClick={(e) => handlePostClick(e, post)}>
                <div key={post.id} className={styles.post}>
                  <div className={styles.postImage}>
                    <img src={post.images[0]} alt="Post image" />
                    <ul className={styles.postInfo}>
                      <li>
                        <HeartIcon /> {post._count.likes}
                      </li>
                      <li>
                        <CommentIcon /> {post._count.comments}
                      </li>
                    </ul>
                  </div>
                </div>
              </a>
            ))}
          </section>
          <div ref={targetRef}></div>
        </div>
      )}
      <PostModal
        post={openPost}
        onCommentSuccess={handleCommentSuccess}
        onLikeSuccess={handleLikeSuccess}
        onClose={closePost}
      />
    </Layout>
  );
}

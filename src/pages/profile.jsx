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
import { useRef, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { followUser, getUserByUsername, getUserPosts, unfollowUser } from 'services/usersService';
import styles from 'styles/profile.module.css';

function useProfilePosts(id) {
  const intersectionRef = useRef();

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

function useProfile(username) {
  const { data, error, refetch } = useQuery(
    ['users', username],
    () => getUserByUsername(username),
    {
      enabled: !!username,
    }
  );

  const displayName = data?.displayName || data?.username;
  const notFound = error === 'Not Found';
  const title = !data
    ? 'Loading...'
    : notFound
    ? 'Page Not Found - Instagram'
    : `${displayName} (@${data.username}) - Instagram photos`;

  const followMutation = useMutation(
    async () => {
      if (data.followedByClient) await unfollowUser(data.id);
      else await followUser(data.id);
    },
    { onSuccess: refetch }
  );

  return { notFound, error, title, followMutation, data: data ? { ...data, displayName } : null };
}

export default function Profile() {
  const { data: client } = useAuth(false);
  const { username } = useParams();
  const { title, notFound, data, followMutation } = useProfile(username);
  useTitle(title);
  const { posts, intersectionRef } = useProfilePosts(data?.id);
  const { selectedPost, handleRequestOpenModal, handlePostClose } = usePostModal(posts);
  const { handleCommentSuccess, handleLikeSuccess } = usePostsQuerySetters([
    'users',
    data?.id,
    'posts',
  ]);

  const handlePostClick = (e, post) => {
    e.preventDefault();
    handleRequestOpenModal(post);
  };

  const handleFollowClick = () => {
    followMutation.mutate();
  };

  return (
    <Layout>
      {notFound && (
        <div>
          <h1>{`Sorry, this page isn't available.`}</h1>
          <p>
            The link you followed may be broken, or the page may have been removed. Go back to
            Instagram.
          </p>
        </div>
      )}

      {data && !notFound && (
        <div>
          <section className={styles.profileInfo}>
            <div className={styles.imageContainer}>
              <ProfileImage src={data.profileImage} className={styles.image}></ProfileImage>
            </div>
            <div className={styles.userInfo}>
              <div className={styles.infoHeader}>
                <h2 className={styles.username}>{data.username}</h2>
                {client.id === data.id ? (
                  <Button asLink={true} to={'/accounts/edit'}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button onClick={handleFollowClick} disabled={followMutation.isLoading}>
                    {data.followedByClient ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
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
              <div>
                <p className={styles.displayName}>{data.displayName}</p>
                {data.bio && <p className={styles.bio}>{data.bio}</p>}
              </div>
            </div>
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
          <div ref={intersectionRef}></div>
        </div>
      )}
      <PostModal
        post={selectedPost}
        onClose={handlePostClose}
        onCommentSuccess={handleCommentSuccess}
        onLikeSuccess={handleLikeSuccess}
      />
    </Layout>
  );
}

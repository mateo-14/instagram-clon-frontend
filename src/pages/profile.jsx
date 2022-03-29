import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import ProfileImage from 'components/common/ProfileImage';
import Layout from 'components/Layout';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from 'services/usersService';
import styles from 'styles/profile.module.css';


export default function Profile() {
  const { username } = useParams();
  const { data, status } = useQuery(['users', username], () => getUserByUsername(username), {
    enabled: !!username,
  });
  const notFound = data?.error === 'Not Found';
  const displayName = data?.displayName || data?.username;

  const { data: posts, status: postsStatus } = useQuery(
    ['users', username, 'posts'],
    () => getUserPosts(data.id),
    { enabled: status === 'success' && !!data }
  );

  const title = !data
    ? 'Loading...'
    : notFound
    ? 'Page Not Found - Instagram'
    : `${displayName} (@${data.username}) - Instagram photos`;

  return (
    <Layout title={title}>
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
              <h2 className={styles.username}>{data.username}</h2>
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
                <p className={styles.displayName}>{displayName}</p>
                {data.bio && <p className={styles.bio}>{data.bio}</p>}
              </div>
            </div>
          </section>
          <section className={styles.posts}>
            {postsStatus === 'success' &&
              posts.map((post) => (
                <Link to={`/posts/${post.id}`} key={post.id}>
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
                </Link>
              ))}
          </section>
        </div>
      )}
    </Layout>
  );
}

import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import ProfileImage from 'components/common/ProfileImage';
import Layout from 'components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getUserByUsername, getUserPosts } from 'services/usersService';
import styles from 'styles/profile.module.css';

export default function Profile() {
  const {
    query: { username },
  } = useRouter();
  const { data, status } = useQuery(['users', username], () => getUserByUsername(username), {
    enabled: !!username,
  });
  const notFound = data?.error === 'Not Found';

  const { data: posts, status: postsStatus } = useQuery(
    ['users', username, 'posts'],
    () => getUserPosts(data.id),
    { enabled: status === 'success' && !!data }
  );

  return (
    <Layout>
      <Head>
        <title>
          {!data
            ? 'Loading...'
            : notFound
            ? 'Page Not Found - Instagram'
            : `${data.displayName} (@${data.username}) - Instagram photos`}
        </title>
      </Head>
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
                <p className={styles.displayName}>{data.displayName}</p>
                {data.bio && <p className={styles.bio}>{data.bio}</p>}
              </div>
            </div>
          </section>
          <section className={styles.posts}>
            {postsStatus === 'success' &&
              posts.map((post) => (
                <Link href={`posts/${post.id}`} key={post.id}>
                  <a>
                    <div key={post.id} className={styles.post}>
                      <div className={styles.postImage}>
                        <Image
                          src={post.images[0]}
                          layout="fill"
                          alt="Post image"
                          objectFit="cover"
                        />
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
                </Link>
              ))}
          </section>
        </div>
      )}
    </Layout>
  );
}

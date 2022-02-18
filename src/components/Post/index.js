import classNames from 'classnames';
import Button from 'components/common/Button';
import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import ProfileImage from 'components/common/ProfileImage';
import TextArea from 'components/common/TextArea';
import Image from 'next/image';
import Link from 'next/link';
import getTimeAgo from 'src/utils/getTimeAgo';
import styles from './Post.module.css';

export default function Post({ post, isFullPost, onClickCommentAction }) {
  const date = new Date(post.createdAt);

  const handleCommentAction = () => {
    if (onClickCommentAction) onClickCommentAction(post.id);
  };

  return (
    <article className={classNames(styles.container, { [styles.fullPost]: isFullPost })}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <Link href={`/${post.author.username}`}>
            <a>
              <ProfileImage src={post.author.profileImage} className={styles.userImage} />
            </a>
          </Link>
          <Link href={`/${post.author.username}`}>
            <a className={styles.userName}>{post.author.username}</a>
          </Link>
        </div>
      </header>

      <div className={styles.image}>
        <Image
          src={post.images[0]}
          layout="fill"
          alt="Post image"
          objectFit="cover"
          className={styles.image}
        />
      </div>

      <section className={styles.actions}>
        <button className={styles.action}>
          <HeartIcon />
        </button>
        <button className={styles.action} onClick={handleCommentAction}>
          <CommentIcon />
        </button>
      </section>

      <section className={styles.likesSection}>
        <button className={styles.likes}>{post._count.likes} likes</button>
      </section>

      {/* Only feed post */}
      <section className={styles.comments}>
        {!isFullPost ? (
          <>
            <PostText author={post.author.username} text={post.text} showLess={true} />
            {post._count.comments > 0 && <span>View all 36 comments</span>}
          </>
        ) : (
          <div className={styles.comment}>
            <ProfileImage src={post.author.profileImage} className={styles.commentAvatar} />
            <PostText author={post.author.username} text={post.text} showLess={true} />
            {/* Map all comments*/}
          </div>
        )}
      </section>
      {/* Only feed post */}

      <section className={styles.date}>
        <Link href="/post">
          <a>
            <time dateTime={date.toLocaleString()} title={date.toLocaleString()}>
              {getTimeAgo(date.getTime()).toUpperCase()}
            </time>
          </a>
        </Link>
      </section>

      <form className={styles.commentForm}>
        <TextArea placeholder="Add a comment..." />
        <Button disabled={true} type="text">
          Post
        </Button>
      </form>
    </article>
  );
}

const PostText = ({ author, text, showLess }) => (
  <p className={styles.text}>
    <Link href={author}>
      <a className={styles.author}>{`${author} `}</a>
    </Link>
    {text}
  </p>
);

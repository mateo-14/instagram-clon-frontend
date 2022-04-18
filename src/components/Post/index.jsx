import classNames from 'classnames';
import Button from 'components/common/Button';
import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import LoadMore from 'components/common/Icons/LoadMore';
import OutlineHeartIcon from 'components/common/Icons/OutlineHeartIcon';
import ProfileImage from 'components/common/ProfileImage';
import TextArea from 'components/common/TextArea';
import { useCommentMutations } from 'hooks/useCommentMutations';
import { usePostMutations } from 'hooks/usePostMutations';
import { useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getComments } from 'services/commentsService';
import { getShortTimeAgo, getTimeAgo } from 'src/utils/getTimeAgo';
import styles from './Post.module.css';

export default function Post({
  data,
  isFullPost = false,
  onRequestOpenModal,
  onLikeSuccess,
  onCommentSuccess,
}) {
  const date = data && new Date(data.createdAt);
  const { likeMutation, commentMutation } = usePostMutations(data);

  const handleLikeAction = () => {
    likeMutation.mutate(null, {
      onSuccess: onLikeSuccess,
    });
  };

  const requestOpenModal = () => {
    if (onRequestOpenModal) onRequestOpenModal(data);
  };

  return (
    <article className={classNames(styles.container, { [styles.fullPost]: isFullPost })}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <Link to={`/${data.author.username}`}>
            <ProfileImage src={data.author.profileImage} className={styles.userImage} />
          </Link>
          <Link to={`/${data.author.username}`} className={styles.userName}>
            {data.author.username}
          </Link>
        </div>
      </header>

      <div className={styles.imageContainer}>
        <div
          className={styles.image}
          onDoubleClick={() => !data.hasClientLike && handleLikeAction()}
        >
          <img src={data.images[0]} />
        </div>
      </div>
      <section className={styles.actions}>
        <button
          className={classNames(styles.action, {
            [styles.liked]: data.hasClientLike,
          })}
          onClick={handleLikeAction}
        >
          {data.hasClientLike ? <HeartIcon /> : <OutlineHeartIcon />}
        </button>
        <button className={styles.action} onClick={requestOpenModal}>
          <CommentIcon />
        </button>
      </section>

      <section className={styles.likesSection}>
        <button className={styles.likes}>
          {data._count.likes + (likeMutation.isLoading ? (data.hasClientLike ? -1 : 1) : 0)} likes
        </button>
      </section>

      {/* Only feed data */}
      <section className={styles.comments}>
        {isFullPost ? (
          <>
            <PostComment
              comment={{ author: data.author, text: data.text, createdAt: data.createdAt }}
              isPostCaption={true}
            />
            <PostComments postId={data.id} />
          </>
        ) : (
          <>
            <PostText author={data.author.username} text={data.text} showLess={true} />
            {data._count.comments > 0 && (
              <button className={styles.viewAllCommentsBtn} onClick={requestOpenModal}>
                View all {data._count.comments} comments
              </button>
            )}
          </>
        )}
      </section>
      {/* Only feed data */}

      <section className={styles.dateSection}>
        <Link to={`/posts/${data.id}`}>
          <time
            dateTime={date.toLocaleString()}
            title={date.toLocaleString()}
            className={styles.date}
          >
            {getTimeAgo(date.getTime()).toUpperCase()}
          </time>
        </Link>
      </section>

      <CommentForm
        postId={data.id}
        commentMutation={commentMutation}
        onCommentSuccess={onCommentSuccess}
      />
    </article>
  );
}

const PostText = ({ author, text }) => (
  <p className={styles.text}>
    <Link to={author} className={styles.author}>
      {`${author} `}
    </Link>
    {text}
  </p>
);

function PostComments({ postId }) {
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['posts', postId, 'comments'],
    ({ pageParam }) => getComments(postId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      },
    }
  );

  return (
    <>
      {data?.pages.flat().map((comment) => (
        <PostComment comment={comment} key={comment.id} />
      ))}
      {hasNextPage && (
        <button onClick={fetchNextPage} className={styles.loadMoreBtn}>
          <LoadMore />
        </button>
      )}
    </>
  );
}

const PostComment = ({ comment, isPostCaption = false }) => {
  const date = new Date(comment.createdAt);
  const { likeMutation } = useCommentMutations(comment);

  const handleLikeClick = () => likeMutation.mutate();

  return (
    <div className={styles.comment} onDoubleClick={() => !comment.hasClientLike && handleLikeClick}>
      <ProfileImage src={comment.author.profileImage} className={styles.commentAvatar} />
      <div>
        <PostText author={comment.author.username} text={comment.text} />
        <div className={styles.commentInfo}>
          <time
            className={styles.commentDate}
            dateTime={date.toLocaleString()}
            title={date.toLocaleString()}
          >
            {getShortTimeAgo(date.getTime())}
          </time>
          {!isPostCaption && (
            <span className={styles.commentLikes}>{comment._count.likes} likes</span>
          )}
        </div>
      </div>
      {!isPostCaption && (
        <button
          className={classNames(styles.action, styles.commentLikeBtn, {
            [styles.liked]: comment.hasClientLike,
          })}
          onClick={handleLikeClick}
        >
          {comment.hasClientLike ? <HeartIcon /> : <OutlineHeartIcon />}
        </button>
      )}
    </div>
  );
};

function CommentForm({ commentMutation, onCommentSuccess }) {
  const [value, setValue] = useState('');
  const isValid = value.trim().length > 0;

  const handleChange = (e) => {
    setValue(e.currentTarget.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValid && !commentMutation.isLoading) {
      try {
        const data = await commentMutation.mutateAsync({ text: value.trim() });
        setValue('');
        onCommentSuccess(data);
      } catch {}
    }
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <TextArea placeholder="Add a comment..." onChange={handleChange} value={value} />
      <Button disabled={!isValid || commentMutation.isLoading} style="text" type="submit">
        Post
      </Button>
    </form>
  );
}

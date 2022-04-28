import classNames from 'classnames';
import Button from 'components/common/Button';
import CommentIcon from 'components/common/Icons/CommentIcon';
import HeartIcon from 'components/common/Icons/HeartIcon';
import LoadMore from 'components/common/Icons/LoadMore';
import OutlineHeartIcon from 'components/common/Icons/OutlineHeartIcon';
import Modal, { ModalBody, ModalContent, ModalHeader } from 'components/common/Modal';
import ProfileImage from 'components/common/ProfileImage';
import TextArea from 'components/common/TextArea';
import { useState, forwardRef } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import * as commentsService from 'services/commentsService';
import { removeLike, addLike, getLikes } from 'services/postsServices';
import useInfinityScroll from 'services/useInfinityScroll';
import { getShortTimeAgo, getTimeAgo } from 'src/utils/getTimeAgo';
import styles from './Post.module.css';

function usePostLikeAction(post) {
  const queryClient = useQueryClient();

  return (onSuccess) => {
    try {
      if (post.hasClientLike) removeLike(post.id);
      else addLike(post.id);

      const likesCount = post._count.likes + (post.hasClientLike ? -1 : 1);

      queryClient.setQueryData(['posts', post.id], (cachedPost) => {
        cachedPost = cachedPost || post;
        return {
          ...cachedPost,
          _count: { ...cachedPost._count, likes: likesCount },
          hasClientLike: !post.hasClientLike,
        };
      });

      if (typeof onSuccess === 'function')
        onSuccess({ postId: post.id, likesCount, hasClientLike: !post.hasClientLike });
    } catch {}
  };
}

const Post = forwardRef(
  ({ data, isFullPost = false, onRequestOpenModal, onLikeSuccess, onCommentSuccess }, ref) => {
    const date = data && new Date(data.createdAt);
    const likeAction = usePostLikeAction(data);
    const [showLikes, setShowLikes] = useState(false);

    const handleLikeAction = () => likeAction(onLikeSuccess);

    const requestOpenModal = () => {
      if (onRequestOpenModal) onRequestOpenModal(data);
    };

    return (
      <article
        className={classNames(styles.container, { [styles.fullPost]: isFullPost })}
        ref={ref}
      >
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
          <img
            className={styles.image}
            src={data.images[0]}
            onDoubleClick={() => !data.hasClientLike && handleLikeAction()}
            alt={`${data.author.username}'s post (${data.text})`}
          />
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
          <button className={styles.likes} onClick={() => setShowLikes(!showLikes)}>
            {data._count.likes} likes
          </button>
          {showLikes && <LikesModal postId={data.id} onClose={() => setShowLikes(false)} />}
        </section>

        {/* Only feed data */}
        <section className={styles.comments}>
          {isFullPost ? (
            <>
              {data.text && (
                <PostComment
                  comment={{ author: data.author, text: data.text, createdAt: data.createdAt }}
                  isPostCaption={true}
                />
              )}
              <PostComments postId={data.id} />
            </>
          ) : (
            <>
              {data.text && (
                <PostText author={data.author.username} text={data.text} showLess={true} />
              )}

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

        <CommentForm post={data} onCommentSuccess={onCommentSuccess} />
      </article>
    );
  }
);

Post.name = 'Post';
export default Post;

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
    ({ pageParam }) => commentsService.getComments(postId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 5) return;
        return lastPage[lastPage.length - 1].id;
      },
      refetchOnMount: false,
    }
  );

  return (
    <>
      {data?.pages.flat().map((comment) => (
        <PostComment comment={comment} key={comment.id} />
      ))}

      {/* Load more commments Button */}
      {hasNextPage && (
        <button onClick={fetchNextPage} className={styles.loadMoreBtn}>
          <LoadMore />
        </button>
      )}
    </>
  );
}

function useCommentLikeAction(comment) {
  const queryClient = useQueryClient();

  return () => {
    try {
      if (comment.hasClientLike) commentsService.removeLike(comment.id);
      else commentsService.addLike(comment.id);

      queryClient.setQueryData(['posts', comment.postId, 'comments'], (comments) => ({
        ...comments,
        pages: comments.pages.map((page) =>
          page.map((c) =>
            c.id === comment.id
              ? {
                  ...c,
                  hasClientLike: !c.hasClientLike,
                  _count: { ...c, likes: c._count.likes + (c.hasClientLike ? -1 : 1) },
                }
              : c
          )
        ),
      }));
    } catch (err) {}
  };
}

function PostComment({ comment, isPostCaption = false }) {
  const commentLikeAction = useCommentLikeAction(comment);
  const date = new Date(comment.createdAt);

  return (
    <div
      className={styles.comment}
      onDoubleClick={() => !comment.hasClientLike && commentLikeAction()}
    >
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
      {/* Like Heart Button */}
      {!isPostCaption && (
        <button
          className={classNames(styles.action, styles.commentLikeBtn, {
            [styles.liked]: comment.hasClientLike,
          })}
          onClick={commentLikeAction}
        >
          {comment.hasClientLike ? <HeartIcon /> : <OutlineHeartIcon />}
        </button>
      )}
    </div>
  );
}

function useAddCommentMutation(post) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ text, commentRepliedId }) => {
      const comment = await commentsService.addComment(post.id, text, commentRepliedId);
      return { postId: post.id, commentsCount: post._count.comments + 1, comment };
    },
    {
      onSuccess: (data) => {
        if (!queryClient.getQueryData(['posts', data.postId, 'comments'])) return;

        queryClient.setQueryData(['posts', data.postId, 'comments'], ({ pages, pageParams }) => {
          return {
            pageParams,
            pages: pages.map((page, i) => (i === 0 ? [data.comment, ...page] : page)),
          };
        });
      },
    }
  );
}

function CommentForm({ onCommentSuccess, post }) {
  const [value, setValue] = useState('');
  const isValid = value.trim().length > 0;
  const addCommentMutation = useAddCommentMutation(post);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid && !addCommentMutation.isLoading)
      addCommentMutation.mutate(
        { text: value.trim() },
        {
          onSuccess: (data) => {
            if (typeof onCommentSuccess === 'function') onCommentSuccess(data);
            setValue('');
          },
        }
      );
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <TextArea
        placeholder="Add a comment..."
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
      />
      <Button disabled={!isValid || addCommentMutation.isLoading} style="text" type="submit">
        Post
      </Button>
    </form>
  );
}

function LikesModal({ onClose, postId }) {
  const { data, hasNextPage, fetchNextPage, status, isFetchingNextPage } = useInfiniteQuery(
    ['posts', postId, 'likes'],
    ({ pageParam }) => getLikes(postId, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < 14) return;
        return lastPage[lastPage.length - 1].id;
      },
    }
  );

  const { rootRef, targetRef } = useInfinityScroll({
    disabled: !hasNextPage || status !== 'success' || isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent showCloseButton={true} onClose={onClose} className={styles.likesModal}>
        <ModalHeader>
          <h1>Likes</h1>
        </ModalHeader>
        <ModalBody className={styles.likesModalBody} ref={rootRef}>
          <ul className={styles.likesModalList}>
            {data?.pages?.flat().map((user) => (
              <li className={styles.likesModalUser} key={user.id}>
                <Link to={`/${user.username}`}>
                  <ProfileImage src={user.profileImage} className={styles.likesModalImg} />
                </Link>
                <div>
                  <Link
                    to={`/${user.username}`}
                    className={classNames(styles.likesModalText, styles.likesModalUsername)}
                  >
                    {user.username}
                  </Link>
                  {user.displayName && (
                    <span
                      className={classNames(styles.likesModalText, styles.likesModalDisplayName)}
                    >
                      {user.displayName}
                    </span>
                  )}
                </div>
              </li>
            ))}
            <div ref={targetRef}></div>
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

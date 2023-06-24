'use client'

import classNames from 'classnames'
import CommentIcon from '@/components/common/Icons/CommentIcon'
import HeartIcon from '@/components/common/Icons/HeartIcon'
import ProfileImage from '@/components/common/ProfileImage'
import { forwardRef, useEffect, useRef, useState } from 'react'
import styles from './Post.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { getTimeAgo } from '@/utils/getTimeAgo'
import PostComment from './PostComment/PostComment'
import PostComments from './PostComments/PostComments'
import PostText from './PostText'
import CommentForm from './CommentForm'
import { addLike, deletePost, getPost, removeLike } from '@/services/postsService'
import useSWRImmutable from 'swr/immutable'
import LikeButton from '../common/LikeButton'
import { usePathname, useRouter } from 'next/navigation'
import Modal, { ModalContent } from '../common/Modal/Modal'
import useAuth from '@/hooks/useAuth'
import { useSWRConfig } from 'swr'
import { usePostListsMutation } from '@/hooks/usePostsListMutation'

interface PostProps {
  id: number
  isInFeed?: boolean
  classes?: {
    container?: string
    comments?: string
    commentForm?: string
  }
  inModal?: boolean
}

function Post ({ id, isInFeed = false, classes = {}, inModal = false }: PostProps, ref: React.ForwardedRef<HTMLElement>): JSX.Element {
  const { data: user } = useAuth(false)
  const { data: post, mutate } = useSWRImmutable(['posts', id], async ([, id]) => await getPost(id), {
    revalidateOnMount: !isInFeed
  })
  const router = useRouter()
  useEffect(() => {
    if (inModal && post == null) {
      router.back()
    }
  }, [post])

  const [showLikes, setShowLikes] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleLike = async (): Promise<void> => {
    if (post == null) return

    void mutate({
      ...post,
      hasClientLike: !post.hasClientLike,
      _count: {
        ...post._count,
        likes: post._count.likes + (post.hasClientLike ? -1 : 1)
      }
    }, {
      revalidate: false
    })

    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      if (post.hasClientLike) {
        await removeLike(post.id, abortControllerRef.current.signal)
      } else {
        await addLike(post.id, abortControllerRef.current.signal)
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }
    }

    void mutate()
    abortControllerRef.current = null
  }

  useEffect(() => {
    if (!likeAnimation) return
    const timeout = setTimeout(() => {
      setLikeAnimation(false)
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [likeAnimation])

  const pathname = usePathname()
  useEffect(() => {
    if (post == null || !pathname.startsWith('/posts')) return

    document.title = `${post.author.username} on Instagram${post.text.length > 0 ? `: "${post.text}"` : ''}`
  }, [pathname, post])

  if (post == null) {
    return <PostSekelton isInFeed={isInFeed} classes={classes} />
  }

  const date = new Date(post.createdAt)

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (isMobile) {
      e.preventDefault()
      location.href = e.currentTarget.href // This is because next/link and router.push() intercept post route and open a modal, and I want to open the post page in mobile.
      return
    }

    sessionStorage.setItem('previousScroll', window.scrollY.toString()) // Temp fix until Next.js fixes this issues: https://github.com/vercel/next.js/issues/49087 and https://github.com/vercel/next.js/issues/50105
  }

  return (
    <article
      className={classNames(styles.container, classes.container, {
        [styles.fullPost]: !isInFeed
      })}
      ref={ref}
    >
      <PostHeader id={post.id} username={post.author.username} profileImage={post.author.profileImage} isClientPost={post.author.id === user?.id} />

      <div className={styles.imageContainer}>
        <Image
          className={styles.image}
          src={post.images[0]}
          onDoubleClick={() => {
            if (post.hasClientLike) return

            setLikeAnimation(true)
            void handleLike()
          }}
          alt={`${post.author.username}'s post (${post.text})`}
          width={1080}
          height={1080}
        />
        <HeartIcon className={classNames(styles.imageLikeHeart, { [styles.show]: likeAnimation })} />
      </div>
      <section className={styles.actions}>
        <LikeButton onClick={handleLike} hasClientLike={post.hasClientLike} className={styles.action} />
        {isInFeed
          ? <Link href={`/posts/${post.id}`} className={styles.action} onClick={handleLinkClick}>
            <CommentIcon />
          </Link>
          : <button className={styles.action}>
            <CommentIcon />
          </button>}
      </section>

      <section className={styles.likesSection}>
        <button className={styles.likes} onClick={() => { setShowLikes(!showLikes) }}>
          {post._count.likes} likes
        </button>
        {/* {showLikes && <LikesModal postId={post.id} onClose={() => { setShowLikes(false) }} />} */}
      </section>

      {/* Only feed data */}
      <div className={styles.commentsWrapper}>
        <section className={classNames(styles.comments, classes.comments)}>
          {!isInFeed
            ? (
              <>
                {Boolean(post.text.length) &&
                  <PostComment
                    comment={{ author: post.author, text: post.text, createdAt: post.createdAt }}
                    isPostCaption={true}
                  />
                }
                <PostComments postId={post.id} />
              </>
              )
            : (
              <>
                {Boolean(post.text.length) &&
                  <PostText author={post.author.username} text={post.text} />
                }
                {post._count.comments > 0 && (
                  <Link href={`/posts/${post.id}`} className={styles.viewAllCommentsBtn} onClick={handleLinkClick}>
                    View all {post._count.comments} comments
                  </Link>
                )}
              </>
              )}
        </section>
      </div>
      {/* Only feed data */}

      <section className={styles.dateSection}>
        <Link href={`/posts/${post.id}`} onClick={handleLinkClick}>
          <time
            dateTime={date.toLocaleString()}
            title={date.toLocaleString()}
            className={styles.date}
          >
            {getTimeAgo(date.getTime()).toUpperCase()}
          </time>
        </Link>
      </section>

      <CommentForm post={post} className={classes.commentForm} />
    </article>
  )
}
const PostWithRef = forwardRef<HTMLElement, PostProps>(Post)
export default PostWithRef

/*
function LikesModal ({ onClose, postId }) {
  const { data, hasNextPage, fetchNextPage, status, isFetchingNextPage } = useInfiniteQuery(
    ['posts', postId, 'likes'],
    ({ pageParam }) => getLikes(postId, pageParam),
    {
      getNextPageParam: lastPage => {
        if (lastPage.length < 14) return
        return lastPage[lastPage.length - 1].id
      }
    }
  )

  const { rootRef, targetRef } = useInfinityScroll({
    disabled: !hasNextPage || status !== 'success' || isFetchingNextPage,
    onIntersect: fetchNextPage
  })

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent showCloseButton={true} onClose={onClose} className={styles.likesModal}>
        <ModalHeader>
          <h1>Likes</h1>
        </ModalHeader>
        <ModalBody className={styles.likesModalBody} ref={rootRef}>
          <ul className={styles.likesModalList}>
            {data?.pages?.flat().map(user => (
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
  )
}
 */

interface PostSekeltonProps {
  isInFeed: boolean
  classes: {
    container?: string
    comments?: string
    commentForm?: string
  }
}

const PostSekelton: React.FC<PostSekeltonProps> = ({ isInFeed, classes }) => <div
  className={classNames(classes.container, {
    [styles.skeletonFullPost]: !isInFeed
  })}
>
  <div className={styles.skeletonContent}>
    <div className={styles.skeletonHeader}>
      <div className={styles.skeletonProfileImage} />
      <div className={styles.skeletonHeaderText}>
        <div />
        <div />
      </div>
    </div>
    <div className={styles.skeletonFullPostExtra}>
      <div />
      <div />
      <div />
    </div>
  </div>

  <div className={styles.skeletonImage} />
</div>

interface PostHeaderProps {
  id: number
  username: string
  profileImage: string
  isClientPost: boolean
}
function PostHeader ({ id, username, profileImage, isClientPost }: PostHeaderProps): JSX.Element {
  const [showOptions, setShowOptions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutate } = useSWRConfig()
  const { mutate: mutateList } = usePostListsMutation()

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await deletePost(id)
      await mutateList((pages) => {
        if (pages == null || pages.length === 0) return pages
        return pages.map(page => page.filter(postId => postId !== id))
      }, { revalidate: false })
      void mutate(['posts', id], null, false)
    } catch {

    }
    setIsDeleting(false)
  }

  const handleGoToPost = (): void => {
    setShowOptions(false)
    location.href = `/posts/${id}` // This is because next/link and router.push() intercept post route and open a modal.
  }

  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${id}`)
      setShowOptions(false)
    } catch {

    }
  }

  const handleCancel = (): void => {
    setShowOptions(false)
  }

  return <>
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <Link href={`/${username}`} className={styles.userImageLink}>
          <ProfileImage src={profileImage} className={styles.userImage} height={32} width={32} />
        </Link>
        <Link href={`/${username}`} className={styles.userName}>
          {username}
        </Link>
      </div>
      <button className={styles.optionsBtn} onClick={() => { setShowOptions(true) }}>
        <svg aria-label="More Options" height="24" role="img" viewBox="0 0 24 24" width="24" fill="currentColor"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
      </button>
    </header>
    {showOptions && <Modal onClose={() => {
      if (isDeleting) return
      setShowOptions(false)
    }} showCloseButton={false}>
      <ModalContent showCloseButton={false} className={styles.optionsModalContent}>
        <ul className={styles.optionsList}>
          {isClientPost && <li className={classNames(styles.optionsListItem, styles.optionsListItemDanger)}><button onClick={handleDelete} disabled={isDeleting}>Delete</button></li>}
          <li className={styles.optionsListItem}><button onClick={handleGoToPost} disabled={isDeleting}>Go to post</button></li>
          <li className={styles.optionsListItem}><button onClick={handleCopyLink} disabled={isDeleting}>Copy link</button></li>
          <li className={styles.optionsListItem}><button onClick={handleCancel} disabled={isDeleting}>Cancel</button></li>
        </ul>
      </ModalContent>
    </Modal>
    }

  </>
}

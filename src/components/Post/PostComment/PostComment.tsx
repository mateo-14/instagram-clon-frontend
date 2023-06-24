
'use client'
import ProfileImage from '@/components/common/ProfileImage'
import styles from './PostComment.module.css'
import PostText from '../PostText/PostText'
import { getShortTimeAgo } from '@/utils/getTimeAgo'
import { type Comment } from '@/types/comment'
import { useSWRConfig } from 'swr'
import { unstable_serialize } from 'swr/infinite'
import { useRef } from 'react'
import { addLike, removeLike } from '@/services/commentsService'
import Link from 'next/link'
import LikeButton from '@/components/common/LikeButton'
import { postsCommentsGetKey } from '@/utils/swrKeys'

type PostCommentProps = {
  isPostCaption: true
  comment: Pick<Comment, 'author' | 'text' | 'createdAt'>
} | {
  isPostCaption?: false
  comment: Comment
}

export default function PostComment ({ comment, isPostCaption = false }: PostCommentProps): JSX.Element {
  const date = new Date(comment.createdAt)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { mutate } = useSWRConfig()

  const handleLike = async (): Promise<void> => {
    void mutate<Comment[][]>(unstable_serialize((index, prev) => postsCommentsGetKey(index, prev, (comment as Comment).postId)), (data) => {
      const newData = data?.map(page => page.map(_comment => {
        if (_comment.id !== (comment as Comment).id) return _comment
        return {
          ..._comment,
          hasClientLike: !_comment.hasClientLike,
          _count: {
            ..._comment._count,
            likes: _comment._count.likes + (_comment.hasClientLike ? -1 : 1)
          }
        }
      }))
      return newData
    }, {
      revalidate: false
    })

    if (abortControllerRef.current != null) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      if ((comment as Comment).hasClientLike) {
        await removeLike((comment as Comment).id, abortControllerRef.current.signal)
      } else {
        await addLike((comment as Comment).id, abortControllerRef.current.signal)
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        return
      }
    }

    void mutate<Comment[][]>(unstable_serialize((index, prev) => postsCommentsGetKey(index, prev, (comment as Comment).postId)))
    abortControllerRef.current = null
  }

  return (
    <div className={styles.comment} onDoubleClick={() => {
      if (!isPostCaption && !(comment as Comment).hasClientLike) {
        void handleLike()
      }
    }}>
      <Link href={`/${comment.author.username}`} prefetch={false}>
        <ProfileImage src={comment.author.profileImage} className={styles.commentAvatar} width={32} height={32} />
      </Link>
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
            <span className={styles.commentLikes}>{(comment as Comment)._count.likes} likes</span>
          )}
        </div>
      </div>

      {!isPostCaption && (
        <LikeButton hasClientLike={(comment as Comment).hasClientLike} onClick={handleLike} className={styles.action} />
      )}
    </div>
  )
}

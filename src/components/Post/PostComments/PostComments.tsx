'use client'

import { getComments } from '@/services/commentsService'
import PostComment from '../PostComment/PostComment'
import styles from './PostComments.module.css'
import useSWRInfinite from 'swr/infinite'
import { type Comment } from '@/types/comment'
import LoadMore from '@/components/common/Icons/LoadMore'
import Loader from '@/components/common/Loader'
import { useState } from 'react'
import { postsCommentsGetKey } from '@/utils/swrKeys'

const MAX_COMMENTS_PER_PAGE = 5

interface PostCommentsProps {
  postId: number
}

export default function PostComments ({ postId }: PostCommentsProps): JSX.Element {
  const { data, setSize, size, isValidating, isLoading } = useSWRInfinite<Comment[]>(
    (pageIndex, previousPageData: Comment[] | null) => postsCommentsGetKey(pageIndex, previousPageData, postId),
    async (key: [string, number | null]) => await getComments(postId, key?.[1]))

  const comments = data?.flat()
  const hasNextPage = Number(data?.at(-1)?.length) === MAX_COMMENTS_PER_PAGE
  const [areAllLoaded, setAreAllLoaded] = useState(false)

  const loadMore = async (): Promise<void> => {
    const comments = await setSize(size + 1)
    if (comments != null && comments[comments.length - 1].length < MAX_COMMENTS_PER_PAGE) {
      setAreAllLoaded(true)
    }
  }

  return (
    <>
      {comments?.map(comment => (
        <PostComment comment={comment} key={comment.id} />
      ))}

      {hasNextPage && !isValidating && !areAllLoaded && (
        <button onClick={loadMore} className={styles.loadMoreBtn}>
          <LoadMore />
        </button>
      )}
      {(isLoading || (hasNextPage && isValidating)) && (
        <Loader className={styles.commentLoader} />
      )}
    </>
  )
}

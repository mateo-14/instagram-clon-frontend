import { useEffect } from 'react'
import { ON_ADD_COMMENT, ON_COMMENT_LIKE_ACTION, ON_POST_LIKE_ACTION } from 'src/events/Events'
import { eventEmitter, queryClient } from 'src/main'

/**
 * This hook listen to posts actions events and update cached posts with postsQueryKey and single cached posts
 */

export default function usePostsChangesListeners(postsQueryKey) {
  useEffect(() => {
    const onPostLikeAction = ({ postId, updatedLikesCount, hasClientLike }) => {
      if (queryClient.getQueryData(['posts', postId])) {
        // Update single cached post (if exists) likes
        queryClient.setQueryData(['posts', postId], cachedPost => ({
          ...cachedPost,
          hasClientLike,
          _count: { ...cachedPost._count, likes: updatedLikesCount }
        }))
      }

      if (postsQueryKey && queryClient.getQueryData(postsQueryKey)) {
        // Update post likes in cached posts list (Feed posts, profile posts)
        queryClient.setQueryData(postsQueryKey, data => ({
          ...data,
          pages: data.pages.map(page =>
            page.map(post =>
              post.id === postId
                ? {
                    ...post,
                    _count: { ...post._count, likes: updatedLikesCount },
                    hasClientLike
                  }
                : post
            )
          )
        }))
      }
    }

    const onCommentLikeAction = ({ postId, commentId, updatedLikesCount, hasClientLike }) => {
      // Update comment likes in cached comments list
      queryClient.setQueryData(['posts', postId, 'comments'], comments => ({
        ...comments,
        pages: comments.pages.map(page =>
          page.map(c =>
            c.id === commentId
              ? {
                  ...c,
                  hasClientLike,
                  _count: { ...c, likes: updatedLikesCount }
                }
              : c
          )
        )
      }))
    }

    const onAddComment = ({ postId, commentsCount, comment }) => {
      if (queryClient.getQueryData(['posts', postId, 'comments'])) {
        // Add created comment to comment cached list
        queryClient.setQueryData(['posts', postId, 'comments'], ({ pages, pageParams }) => {
          return {
            pageParams,
            pages: pages.map((page, i) => (i === 0 ? [comment, ...page] : page))
          }
        })
      }

      if (postsQueryKey && queryClient.getQueryData(postsQueryKey)) {
        // Update post comments count in cached posts list
        queryClient.setQueryData(postsQueryKey, data => ({
          ...data,
          pages: data.pages.map(page =>
            page.map(post =>
              post.id === postId
                ? {
                    ...post,
                    _count: { ...post._count, comments: commentsCount }
                  }
                : post
            )
          )
        }))
      }
    }

    eventEmitter.on(ON_POST_LIKE_ACTION, onPostLikeAction)
    eventEmitter.on(ON_COMMENT_LIKE_ACTION, onCommentLikeAction)
    eventEmitter.on(ON_ADD_COMMENT, onAddComment)

    return () => {
      eventEmitter.off(ON_POST_LIKE_ACTION, onPostLikeAction)
      eventEmitter.off(ON_COMMENT_LIKE_ACTION, onCommentLikeAction)
      eventEmitter.off(ON_ADD_COMMENT, onAddComment)
    }
  }, [queryClient, postsQueryKey])
}

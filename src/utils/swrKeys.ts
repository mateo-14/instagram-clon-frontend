import { type Comment } from '@/types/comment'

export function userPostsGetKey (pageIndex: number, previousPageData: number[] | null, username: string | null): [string, number | null] | null {
  if (((previousPageData != null) && previousPageData.length === 0) || username == null) return null
  if (pageIndex === 0) return [`users/${username}/posts`, null]

  return [`users/${username}/posts`, previousPageData?.at(-1) ?? null]
}

export function feedPostsGetKey (pageIndex: number, previousPageData: number[] | null): [string, number | null] | null {
  if ((previousPageData != null) && previousPageData.length === 0) return null
  if (pageIndex === 0) return ['posts/feed', null]

  return ['posts/feed', previousPageData?.at(-1) ?? null]
}

export function postsCommentsGetKey (pageIndex: number, previousPageData: Comment[] | null, postId: number): [string, number | null] | null {
  if ((previousPageData != null) && previousPageData.length === 0) return null
  if (pageIndex === 0) return [`posts/${postId}/Comments`, null]

  return [`posts/${postId}/comments`, previousPageData?.at(-1)?.id ?? null]
}

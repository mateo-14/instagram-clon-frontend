import restService from './restService'
import { getTokenWithThrow } from './authService'
import { type Post } from '@/types/post'
import { type Comment } from '@/types/comment'

export async function getComments (postId: Post['id'], last?: Post['id'] | null): Promise<Comment[]> {
  const token = getTokenWithThrow()

  const res = await restService.get<Comment[]>(`posts/${postId}/comments${last != null ? `?last=${last}` : ''}`, {
    headers: { authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function addComment (postId: Post['id'], text: string): Promise<Comment> {
  const token = getTokenWithThrow()

  const res = await restService.post<Comment>(
    `posts/${postId}/comments`,
    { text },
    { headers: { authorization: `Bearer ${token}` } }
  )

  return res.data
}

export async function addLike (id: Comment['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.put(`comments/${id}/likes`, null, {
    headers: { authorization: `Bearer ${token}` },
    signal
  })
}

export async function removeLike (id: Comment['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.delete(`comments/${id}/likes`, {
    headers: { authorization: `Bearer ${token}` },
    signal
  })
}

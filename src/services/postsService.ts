import { type User } from '@/types/user'
import { getTokenWithThrow } from './authService'
import restService from './restService'
import { type Post } from '@/types/post'

export async function createPost (file: File, caption: string): Promise<Post> {
  const token = getTokenWithThrow()

  const formData = new FormData()
  formData.set('images', file)
  formData.set('text', caption)

  const res = await restService.post('posts', formData, {
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
  })

  return res.data
}

export async function getFeed (last?: Post['id'] | null): Promise<Post[]> {
  const token = getTokenWithThrow()

  const res = await restService.get<Post[]>(`posts/feed${last != null ? (`?last=${last}`) : ''}`, {
    headers: { authorization: `Bearer ${token}` }
  })

  return res.data
}

export async function getPost (id: Post['id']): Promise<Post> {
  const token = getTokenWithThrow()

  const res = await restService.get<Post>(`posts/${id}`, {
    headers: { authorization: `Bearer ${token}` }
  })

  return res.data
}

export async function addLike (id: Post['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.put(`posts/${id}/likes`, null, {
    headers: { authorization: `Bearer ${token}` },
    signal
  })
}

export async function removeLike (id: Post['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.delete(`posts/${id}/likes`, {
    headers: { authorization: `Bearer ${token}` },
    signal
  })
}

// TODO Change any to type
export async function getLikes (id: Post['id'], last?: number | null): Promise<any> {
  const token = getTokenWithThrow()

  return await restService.get(`posts/${id}/likes${last != null ? `?last=${last}` : ''}`, {
    headers: { authorization: `Bearer ${token}` }
  })
}

export async function getUserPosts (userId: User['id'], last?: Post['id'] | null): Promise<Post[]> {
  const token = getTokenWithThrow()

  const res = await restService.get<Post[]>(`users/${userId}/posts${last != null ? `?last=${last}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.data
}

export async function deletePost (id: Post['id']): Promise<void> {
  const token = getTokenWithThrow()

  await restService.delete(`posts/${id}`, {
    headers: { authorization: `Bearer ${token}` }
  })
}

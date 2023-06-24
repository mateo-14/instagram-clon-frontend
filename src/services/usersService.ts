import { type User } from '@/types/user'
import { getTokenWithThrow } from './authService'
import restService from './restService'

export async function getUserByUsername (username: User['username']): Promise<User> {
  const token = getTokenWithThrow()

  const res = await restService.get<User>(`users/profiles/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.data
}

export async function getUserById (id: User['id']): Promise<User> {
  const token = getTokenWithThrow()

  const res = await restService.get<User>(`users/${id}`, { headers: { Authorization: `Bearer ${token}` } })

  return res.data
}

export async function followUser (id: User['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.put(`users/${id}/followers`, null, {
    headers: { Authorization: `Bearer ${token}` },
    signal
  })
}

export async function unfollowUser (id: User['id'], signal?: AbortSignal): Promise<void> {
  const token = getTokenWithThrow()

  await restService.delete(`users/${id}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
    signal
  })
}
/*
export async function uploadPhoto (file: File): Promise<unknown> {
  const token = getTokenWithThrow()

  const formData = new FormData()
  formData.set('image', file)
  return await restService.put('users/me/photo', formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
  })
}

export async function editProfile (data: unknown): Promise<unknown> {
  const token = getTokenWithThrow()

  return await restService.patch('users/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
} */

export async function getSuggestedUsers (): Promise<User[]> {
  const token = getTokenWithThrow()

  const res = await restService.get('users/suggestions', {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.data
}

import { getTokenWithReject } from './authService';
import restService from './restService';

export async function getUserByUsername(username) {
  const token = await getTokenWithReject();

  return restService.get(`users/profiles/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getUserPosts(id, last) {
  return restService.get(`users/${id}/posts${last ? '?last=' + last : ''}`);
}

export async function getUserById(id) {
  const token = await getTokenWithReject();

  return restService.get(`users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function followUser(id) {
  const token = await getTokenWithReject();

  return restService.put(`users/${id}/followers`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function unfollowUser(id) {
  const token = await getTokenWithReject();

  return restService.delete(`users/${id}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

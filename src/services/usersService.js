import { getTokenWithReject } from './authService';
import restService from './restService';

export function getUserByUsername(username) {
  return restService.get(`users/profiles/${username}`);
}

export function getUserPosts(id, last) {
  return restService.get(`users/${id}/posts${last ? '?last=' + last : ''}`);
}

export async function getUserById(id) {
  const token = await getTokenWithReject();

  return restService.get(`users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

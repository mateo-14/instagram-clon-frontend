import { getTokenWithReject } from './authService';
import restService from './restService';

export async function createPost(file, caption) {
  const token = await getTokenWithReject();

  const formData = new FormData();
  formData.set('images', file);
  formData.set('text', caption);

  return restService.post('posts', formData, {
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
}

export async function getFeed(last) {
  const token = await getTokenWithReject();

  return restService.get(`posts/feed${last ? '?last=' + last : ''}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function getPost(id) {
  const token = await getTokenWithReject();

  return restService.get(`posts/${id}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function addLike(id) {
  const token = await getTokenWithReject();

  return restService.put(`posts/${id}/likes`, null, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function removeLike(id) {
  const token = await getTokenWithReject();

  return restService.delete(`posts/${id}/likes`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function getLikes(id, last) {
  const token = await getTokenWithReject();

  return restService.get(`posts/${id}/likes${last ? '?last=' + last : ''}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function getUserPosts(userId, last) {
  const token = await getTokenWithReject();

  return restService.get(`users/${userId}/posts${last ? '?last=' + last : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

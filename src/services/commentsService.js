import restService from './restService';
import { getTokenWithReject } from './authService';

export async function getComments(postId, last) {
  const token = await getTokenWithReject();
  if (last) query.set('last', last);

  return restService.get(`posts/${postId}/comments${last ? '?last=' + last : ''}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function addComment(postId, text) {
  const token = await getTokenWithReject();

  return restService.post(
    `posts/${postId}/comments`,
    { text },
    { headers: { authorization: `Bearer ${token}` } }
  );
}

export async function addLike(id) {
  const token = await getTokenWithReject();

  return restService.put(`comments/${id}/likes`, null, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function removeLike(id) {
  const token = await getTokenWithReject();

  return restService.delete(`comments/${id}/likes`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

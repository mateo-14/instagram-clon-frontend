import restService from './restService';
import { getTokenWithReject } from './authService';

export async function getComments(post, last, replied) {
  const token = await getTokenWithReject();

  const query = new URLSearchParams();
  query.set('post', post);
  if (last) query.set('last', last);
  if (replied) query.set('replied', replied);

  return restService.get(`comments?${query.toString()}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function addComment(postId, text, commentRepliedId) {
  const token = await getTokenWithReject();

  return restService.post(
    `comments`,
    { postId, text, commentRepliedId },
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

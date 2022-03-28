import axios from 'axios';
import { getToken } from './authService';
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/comments`;

export function getComments(post, last, replied) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    const query = new URLSearchParams();
    query.set('post', post);
    if (last) query.set('last', last);
    if (replied) query.set('replied', replied);

    axios
      .get(`${ENDPOINT}?${query.toString()}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

export function addComment(postId, text, commentRepliedId) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .post(
        `${ENDPOINT}`,
        { postId, text, commentRepliedId },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

export function addLike(id) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .put(`${ENDPOINT}/${id}/likes`, null, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

export function removeLike(id) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .delete(`${ENDPOINT}/${id}/likes`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

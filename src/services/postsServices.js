import axios from 'axios';
import { getToken } from './authService';
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/posts`;

export function createPost(file, caption) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    const formData = new FormData();
    formData.set('images', file);
    formData.set('text', caption);
    axios
      .post(ENDPOINT, formData, {
        headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

export function getFeed(last) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .get(`${ENDPOINT}/feed${last ? '?last=' + last : ''}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

export function getPost(id) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .get(`${ENDPOINT}/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      })
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

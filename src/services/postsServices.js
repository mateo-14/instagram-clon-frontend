import axios from 'axios';
import { getToken } from './authService';
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/posts`;

export function createPost(file, caption) {
  const token = getToken();

  const formData = new FormData();
  formData.set('images', file);
  formData.set('text', caption);
  return axios
    .post(ENDPOINT, formData, {
      headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    })
    .then(({ data }) => data)
    .catch(({ response }) => reject({ error: response?.data }));
}

export function getFeed(last) {
  const token = getToken();

  return axios
    .get(`${ENDPOINT}/feed${last ? '?last=' + last : ''}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
    .catch(({ response }) => ({ error: response?.data }));
}

export function getPost(id) {
  const token = getToken();

  return axios
    .get(`${ENDPOINT}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
    .catch(({ response }) => ({ error: response?.data }));
}

import axios from 'axios';
import { getToken } from './authService';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/users`;

export function getUserByUsername(username) {
  return axios
    .get(`${ENDPOINT}/profiles/${username}`)
    .then(({ data }) => data)
    .catch(({ response }) => ({ error: response?.data }));
}

export function getUserPosts(id, last) {
  return axios
    .get(`${ENDPOINT}/${id}/posts${last ? '?last=' + last : ''}`)
    .then(({ data }) => data)
    .catch(({ response }) => ({ error: response?.data }));
}

export function getUserById(id) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    if (!token) return reject({ error: 'Not token' });

    axios
      .get(`${ENDPOINT}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

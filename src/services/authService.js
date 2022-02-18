import axios from 'axios';

const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export function login(data) {
  return axios
    .post(`${ENDPOINT}/login`, data)
    .then(({ data }) => data)
    .catch(({ response }) => {
      if (response.data.errors) return response.data;
      return { error: response.data };
    });
}

export function signUp(data) {
  return axios
    .post(`${ENDPOINT}/signup`, data)
    .then(({ data }) => data)
    .catch(({ response }) => {
      if (response.data.errors) return response.data;
      return { error: response.data };
    });
}

export function auth() {
  const token = getToken();

  return axios
    .get(`${ENDPOINT}`, { headers: { authorization: `Bearer ${token}` } })
    .then(({ data }) => data)
    .catch(({ response }) => ({ error: response?.data }));
}

export function getToken() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');
  return token;
}

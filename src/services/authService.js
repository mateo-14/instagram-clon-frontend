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
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) return reject();

    return axios
      .get(`${ENDPOINT}`, { headers: { authorization: `Bearer ${token}` } })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response.data }));
  });
}

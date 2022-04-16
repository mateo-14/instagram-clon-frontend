import restService from './restService';

export function login(data) {
  return restService.post('auth/login', data);
}

export function signUp(data) {
  return restService.post('auth/signup', data);
}

export async function auth() {
  const token = await getTokenWithReject();

  return restService.get('auth', { headers: { authorization: `Bearer ${token}` } }).catch((err) => {
    if (err.status === 401) {
      deleteToken();
    }
    return Promise.reject(err);
  });
}

export function loginWithATestAccount() {
  return restService.get('auth/testAccount');
}

export function getToken() {
  const token = localStorage.getItem('token');
  return token;
}

export function deleteToken() {
  localStorage.removeItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function getTokenWithReject() {
  const token = getToken();
  if (!token) return Promise.reject({ error: 'Not token' });

  return token;
}

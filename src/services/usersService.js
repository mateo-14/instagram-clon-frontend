import { getTokenWithReject } from './authService';
import restService from './restService';

export async function getUserByUsername(username) {
  const token = await getTokenWithReject();

  return restService.get(`users/profiles/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getUserById(id) {
  const token = await getTokenWithReject();

  return restService.get(`users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

export async function followUser(id) {
  const token = await getTokenWithReject();

  return restService.put(`users/${id}/followers`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function unfollowUser(id) {
  const token = await getTokenWithReject();

  return restService.delete(`users/${id}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function uploadPhoto(file) {
  const token = await getTokenWithReject();

  const formData = new FormData();
  formData.set('image', file);
  return restService.put(`users/me/photo`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
}

export async function editProfile(data) {
  const token = await getTokenWithReject();

  return restService.patch(`users/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}


export async function getSuggestedUsers() {
  const token = await getTokenWithReject();

  return restService.get(`users/suggestions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

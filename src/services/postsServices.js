import axios from 'axios';
const ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/posts`;

export function createPost(file, caption) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    if (!token) return reject();
    const formData = new FormData();
    formData.set('images', file);
    formData.set('text', caption);
    return axios
      .post(`${ENDPOINT}`, formData, {
        headers: { authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      })
      .then(({ data }) => resolve(data))
      .catch(({ response }) => reject({ error: response?.data }));
  });
}

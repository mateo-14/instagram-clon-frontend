import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

const client = axios.create({ baseURL: URL });
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error, error.response);
    }
    const data = { status: error.response.status };
    if (error.response.data.errors) data.errors = error.response.data.errors;

    return Promise.reject(data);
  }
);

export default client;

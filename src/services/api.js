import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getApiErrorMessage(error);
    return Promise.reject(new Error(message));
  }
);

export function getApiErrorMessage(error) {
  if (error.response) {
    const data = error.response.data;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.title) {
      return data.title;
    }

    if (Array.isArray(data?.errors)) {
      return data.errors.join(', ');
    }

    if (typeof data === 'object' && data !== null) {
      const messages = Object.values(data).flat().filter(Boolean);
      if (messages.length) {
        return messages.join(', ');
      }
    }

    return `Request failed with status ${error.response.status}.`;
  }

  if (error.request) {
    return 'Unable to reach the server. Please ensure the API is running.';
  }

  return error.message || 'An unexpected error occurred.';
}

export default api;

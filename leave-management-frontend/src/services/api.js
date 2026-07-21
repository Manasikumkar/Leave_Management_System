// import axios from 'axios';
// import { TOKEN_KEY } from '../utils/constants';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
//   headers: { 'Content-Type': 'application/json' }
// });

// // Attach token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle expired / invalid token globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     // 401 = unauthenticated, 403 = token expired or forbidden
//     if (status === 401 || status === 403) {
//       localStorage.removeItem(TOKEN_KEY);   // clear expired token
//       // Only redirect if not already on login page
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }

//     const message =
//       error.response?.data?.message ||
//       error.response?.data ||
//       error.message ||
//       'Something went wrong';

//     return Promise.reject(new Error(message));
//   }
// );

// export default api;


import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired / invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 401 = unauthenticated, 403 = token expired or forbidden
    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);   // clear expired token
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(message));
  }
);

export default api;




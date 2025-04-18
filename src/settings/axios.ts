import axios from 'axios'
import useAuthStore from "../stores/AuthStore.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
})


/**
 * Request interceptor
 * Automatically adds the authentication token to request headers if available
 *
 * @param {object} config - The axios request configuration
 * @returns {object} Modified request configuration with auth token
 */
axiosInstance.interceptors.request.use(
  (config) => {
      const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  error => Promise.reject(error),
)


export default axiosInstance

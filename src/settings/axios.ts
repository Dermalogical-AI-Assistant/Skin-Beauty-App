  /**
   * Axios instance configuration.
   * Creates a custom axios instance with base URL from environment variables
   * and configures request interceptors for authentication.
   *
   * @module axiosInstance
   */
  import axios from 'axios'
  import useAuthStore from "../stores/AuthStore.ts";

  /**
   * Custom axios instance with predefined configuration
   * Uses the API URL from environment variables as the base URL for all requests
   */
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
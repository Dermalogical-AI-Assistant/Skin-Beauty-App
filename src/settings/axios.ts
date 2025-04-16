/**
 * Axios instance configuration.
 * Creates a custom axios instance with base URL from environment variables
 * and configures request interceptors for authentication.
 *
 * @module axiosInstance
 */
import axios from 'axios'

/**
 * Custom axios instance with predefined configuration
 * Uses the API URL from environment variables as the base URL for all requests
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
})

export default axiosInstance
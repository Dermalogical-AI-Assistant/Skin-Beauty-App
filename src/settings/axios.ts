import axios from 'axios'
import useAuthStore from "../stores/AuthStore.ts";
import { REQUEST_REFRESH } from "../constants/apis.ts";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
})

// Flag để tránh multiple refresh token calls đồng thời
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request interceptor
 * Automatically adds the authentication token to request headers if available
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

/**
 * Response interceptor
 * Handles token refresh when receiving 401 errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, đợi cho đến khi hoàn thành
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        // Không có refresh token, logout ngay
        useAuthStore.getState().logout();
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}${REQUEST_REFRESH}`, {
          deviceId: "hihi",
          refreshToken: refreshToken,
          type: "ACCESS_TOKEN"
        });

        const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data;

        // Update tokens trong store
        useAuthStore.getState().login(newAccessToken, newRefreshToken || refreshToken);

        // Update header cho request ban đầu
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process tất cả các request đang đợi
        processQueue(null, newAccessToken);

        isRefreshing = false;

        // Retry request ban đầu với token mới
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh token thất bại, logout user
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();

        // Có thể redirect về login page nếu cần
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
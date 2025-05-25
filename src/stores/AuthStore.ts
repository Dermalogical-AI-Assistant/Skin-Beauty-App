import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../settings/axios';

/**
 * Interface defining the structure of the authentication state
 */
interface AuthState {
  accessToken : string | null;
  refreshToken : string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isLogin: boolean;
}

/**
 * Interface defining the actions for the authentication store
 */
interface AuthActions {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (userProfile: any) => void;
  clearError: () => void;
  refreshAccessToken: (newAccessToken: string, newRefreshToken?: string) => void;
}

/**
 * Combined type for the complete auth store
 */
type AuthStore = AuthState & AuthActions;

/**
 * Auth Store created with Zustand
 * Handles authentication state and provides actions for login, logout, and profile updates
 * Persists auth state to localStorage
 */
const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: false,
      error: null,
      isLogin: false,

      login: (accessToken: string, refreshToken: string) => {
        // Update state
        set({
          accessToken,
          refreshToken,
          isLoading: false,
          error: null,
          isLogin: true
        });
      },

      logout: () => {
        // Clear authorization header
        delete axios.defaults.headers.common['Authorization'];

        // Clear state
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
          error: null,
          isLogin: false
        });

        // Optional: Clear localStorage manually if needed
        // localStorage.removeItem('auth-storage');

        // Optional: Redirect to login page
        // window.location.href = '/login';
      },

      refreshAccessToken: (newAccessToken: string, newRefreshToken?: string) => {
        const currentState = get();
        set({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || currentState.refreshToken,
          isLoading: false,
          error: null,
          isLogin: true
        });
      },

      updateUser: (userProfile: any) => {
        set({ user: userProfile });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // name of localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isLogin: state.isLogin,
      }),
    }
  )
);

export default useAuthStore;
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
        (set) => ({
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
                delete axios.defaults.headers.common['Authorization'];

                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isLoading: false,
                    error: null,
                    isLogin: false
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
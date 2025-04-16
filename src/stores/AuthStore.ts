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
            // Initial state
            accessToken: null,
            refreshToken: null,
            user: null,
            isLoading: false,
            error: null,
            isLogin: false,

            /**
             * Login user with token and user profile
             * @param token Authentication token
             * @param userProfile User profile data
             */
            login: (accessToken: string, refreshToken: string) => {
                // Set token in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Update state
                set({
                    accessToken,
                    refreshToken,
                    isLoading: false,
                    error: null,
                    isLogin: true
                });
            },

            /**
             * Log out the current user
             */
            logout: () => {
                // Remove token from axios headers
                delete axios.defaults.headers.common['Authorization'];

                // Reset state
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isLoading: false,
                    error: null,
                    isLogin: false
                });
            },

            /**
             * Update user profile data
             * @param userProfile Updated user profile data
             */
            updateUser: (userProfile: any) => {
                set({ user: userProfile });
            },

            /**
             * Clear any error in the store
             */
            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage', // name of the localStorage key
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
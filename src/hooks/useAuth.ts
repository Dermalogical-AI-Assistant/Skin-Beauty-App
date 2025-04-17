// src/hooks/useAuth.ts
import {
    REQUEST_lOGIN_ACCOUNT,
    REQUEST_LOGOUT,
    REQUEST_UPDATE_PROFILE,
} from "../constants/apis";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../stores/AuthStore";
import isEmpty from "lodash/isEmpty";
import { useNavigate, useLocation } from "react-router-dom";
// import { notificationShow } from "../components/Notification";
import { HOME } from "../constants/routes";

import {useState} from "react";

/**
 * Interface for login data
 */
interface LoginData {
    email: string;
    password: string;
    deviceId: string;
}

/**áđá
 * Custom hook for authentication operations
 * Integrates with AuthStore and uses React Query for API calls
 */
function useAuth() {
    const { login, logout, user: userProfile, updateUser } = useAuthStore();
    const isAuthenticated = !isEmpty(userProfile);
    const navigate = useNavigate();
    const location = useLocation();
    const [redirectPath, setRedirectPath] = useState(location.state?.historyLocation.pathname || HOME);

    /**
     * Update user profile data
     * @param userProfile New user profile data
     */
    const updateUserProfile = (userProfile: any) => {
        updateUser(userProfile);
    };

    /**
     * Mutation for login with username and password
     */
    const handleLoginPassword = useMutation({
        mutationKey: ["login"],
        mutationFn: (data: LoginData) => {
            return axios.post(REQUEST_lOGIN_ACCOUNT, data);
        },
    });

    const handleGetProfile = useMutation({
        mutationKey: ["getProfile"],
        mutationFn: () => {
            const res = axios.get(REQUEST_UPDATE_PROFILE);
            console.log("Profile response hahah:", res);
            return res;
        },
    });

    /**
     * Submit login form data
     * @param data Login credentials (username and password)
     * @param onError Callback function for handling errors
     */
    const onSubmitAccountForm = (
      data: { email: string; password: string; deviceId: string },
      onError: (error: any) => void
    ) => {
        // Get the intended destination from location state or default to home
        handleLoginPassword.mutate(data, {
            onSuccess: (response) => {
                console.log("Login success:", response.data);
                login(
                    response.data.access_token,
                    response.data.refresh_token,
                );
                // Fetch user profile after login success
                handleGetProfile.mutate(undefined, {
                    onSuccess: (profileResponse) => {
                        console.log("Profile response:", profileResponse);
                        if (profileResponse?.data) {
                            console.log("User profile fetched:", profileResponse.data);
                            updateUserProfile(profileResponse.data);
                        } else {
                            console.error("Profile response is missing data:", profileResponse);
                        }

                        // Navigate to the original intended destination
                        navigate(redirectPath, { replace: true });

                        // notificationShow("success", "Success!", "Đăng nhập thành công!");
                    },
                    onError: (profileError) => {
                        console.error("Failed to fetch user profile:", profileError);
                    },
                });
            },
            onError: (error) => onError(error),
        });
    };

    /**
     * Mutation for logging out
     */
    const handleLogout = useMutation({
        mutationKey: ["logout"],
        mutationFn: () => {
            logout();
            return axios.post(REQUEST_LOGOUT);
        },
    });



    return {
        userProfile,
        isAuthenticated,
        onSubmitAccountForm,
        handleLoginPassword,
        logout: handleLogout,
        updateUserProfile,
    };
}

export default useAuth;
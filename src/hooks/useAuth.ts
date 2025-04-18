import {
  REQUEST_lOGIN,
  REQUEST_LOGOUT,
  REQUEST_GET_MY_PROFILE,
} from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../stores/AuthStore";
import isEmpty from "lodash/isEmpty";
import { useNavigate, useLocation } from "react-router-dom";
import { HOME } from "../constants/routes";
import { useState } from "react";
import { User } from "../types/Users";

interface LoginData {
  email: string;
  password: string;
  deviceId: string;
}

function useAuth() {
  const { login, logout, user: userProfile, updateUser } = useAuthStore();
  const isAuthenticated = !isEmpty(userProfile);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(
    location.state?.historyLocation.pathname || HOME,
  );

  const updateUserProfile = (userProfile: User) => {
    updateUser(userProfile);
  };

  const handleLoginPassword = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginData) => {
      return axios.post(REQUEST_lOGIN, data);
    },
  });

  const handleGetProfile = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const res = await axios.get<User>(REQUEST_GET_MY_PROFILE);
      return res.data;
    },
  });

  const onSubmitAccountForm = (
    data: LoginData,
    onError: (error: any) => void,
  ) => {
    handleLoginPassword.mutate(data, {
      onSuccess: async (response) => {
        login(response.data.access_token, response.data.refresh_token);

        try {
          const { data: profile } = await handleGetProfile.refetch();

          if (profile) {
            updateUserProfile(profile);
            navigate(redirectPath, { replace: true });
          } else {
            console.error("Profile response is missing data:", profile);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      },

      onError: (error) => onError(error),
    });
  };

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

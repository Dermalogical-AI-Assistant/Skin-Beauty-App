import { REQUEST_USERS_MODULE } from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import {
  GetUsersRequestParam,
  GetUsersResponse,
  UserFormData,
} from "../types/Users";
import { DEFAULT_PASSWORD } from "../constants/properties";

function useUsers() {

  const getUsers = (params: GetUsersRequestParam) => {
    return useQuery<GetUsersResponse>({
      queryKey: ["users", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetUsersRequestParam];

        const mappedParams: Record<string, any> = {
          ...params,
          roleTypes: params.roleTypes?.length
            ? params.roleTypes.join(",")
            : undefined,
          genders: params.genders?.length
            ? params.genders.join(",")
            : undefined,
        };

        const res = await axios.get<GetUsersResponse>(REQUEST_USERS_MODULE, {
          params: mappedParams,
        });
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
  };

  const createUser = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (user: UserFormData) => {
      const data = { ...user, password: DEFAULT_PASSWORD };
      return axios.post(REQUEST_USERS_MODULE, data);
    },
  });

  const updateUser = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: (user: UserFormData) => {
      const { id, email, ...userData } = user;
      return axios.put(`${REQUEST_USERS_MODULE}/${id}`, userData);
    },
  });

  const deleteUser = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: (id: string) => {
      return axios.delete(`${REQUEST_USERS_MODULE}/${id}`);
    },
  });

  return {
    getUsers,
    createUser,
    updateUser,
    deleteUser
  };
}

export default useUsers;

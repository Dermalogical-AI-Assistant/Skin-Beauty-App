import {
  REQUEST_GET_MY_PROFILE
} from './../constants/apis';
import { useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';
function useTestSetAccessToken() {

  const fetchUserInfo = useQuery({
    queryKey: ['get-categories'],
    queryFn: () => {
        return axios.get(REQUEST_GET_MY_PROFILE);
    },
    enabled: false,
  });

  return {
    fetchUserInfo,
  };
}

export default useTestSetAccessToken;
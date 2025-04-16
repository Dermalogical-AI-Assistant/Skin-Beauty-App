import {
  REQUEST_UPDATE_PROFILE
} from './../constants/apis';
import { useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';
function useTestSetAccessToken() {

  const fetchUserInfo = useQuery({
    queryKey: ['get-categories'],
    queryFn: () => {
        return axios.get(REQUEST_UPDATE_PROFILE);
    },
    enabled: false,
  });

  return {
    fetchUserInfo,
  };
}

export default useTestSetAccessToken;
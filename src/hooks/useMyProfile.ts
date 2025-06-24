import {
  REQUEST_COMMENTS,
  REQUEST_GET_MY_PROFILE
} from "./../constants/apis";
import { useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';
function useMyProfile() {

  const useFetchMyProfile = () => {
    // Only enable query if productId exists
    return useQuery({
      queryKey: ["my-profile"],
      queryFn: async () => {
        const res = await axios.get(REQUEST_GET_MY_PROFILE);
        return res.data
      },
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useFetchMyProfile,
  };
}


export default useMyProfile;
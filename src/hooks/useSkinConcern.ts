import { REQUEST_SKINCONCERN } from "../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";

interface Response {
  data: string[]
}

function useProducts() {
  const getSkinConcerns = () => {
    return useQuery({
      queryKey: ["skin-concern"],
      queryFn: async () => {
        const res = await axios.get(REQUEST_SKINCONCERN);
        console.log(res.data)
        return res.data as Response;
      },
      refetchOnWindowFocus: false,
    });
  };


  return {
    getSkinConcerns,
  };
}

export default useProducts;

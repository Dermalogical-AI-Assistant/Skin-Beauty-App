import { REQUEST_PRODUCTS } from "../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { GetProductRequestParam, GetProductsResponse } from "../types/Products.ts";

function useProducts() {
  const getProducts = (params: GetProductRequestParam) => {
    return useQuery<GetProductsResponse>({
      queryKey: ["product", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetProductRequestParam];
        const res = await axios.get<GetProductsResponse>(REQUEST_PRODUCTS, {params});
        console.log(res.data)
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
  };


  return {
    getProducts,
  };
}

export default useProducts;

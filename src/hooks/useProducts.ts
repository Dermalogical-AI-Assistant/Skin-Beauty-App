import { REQUEST_PRODUCTS } from "../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { GetProductRequestParam, GetProductsResponse } from "../types/Products.ts";
import qs from "qs";

function useProducts() {
  const getProducts = (params: GetProductRequestParam) => {
    return useQuery<GetProductsResponse>({
      queryKey: ["product", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetProductRequestParam];
        const res = await axios.get<GetProductsResponse>(REQUEST_PRODUCTS, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' }) // skincareConcerns=DRY_SKIN&skincareConcerns=ACNE
          },});
        return res.data as GetProductsResponse;
      },
      refetchOnWindowFocus: false,
    });
  };

  return {
    getProducts,
  };
}

export default useProducts;

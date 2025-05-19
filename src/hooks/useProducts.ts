import { REQUEST_PRODUCTS } from "../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { GetProductRequestParam, GetProductsResponse, Product } from "../types/Products.ts";
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

  const getProductDetails = (id:string) => {
    return useQuery<Product>({
      queryKey: ["product", id],
      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey as [string, GetProductRequestParam];
        const res = await axios.get<Product>(
          `${ REQUEST_PRODUCTS }/${ id }`);

        console.log(res.data);
        return res.data as Product;
      },
      refetchOnWindowFocus: false,
    });
  };

  return {
    getProducts,
    getProductDetails
  };
}

export default useProducts;

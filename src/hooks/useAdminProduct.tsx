import { REQUEST_DELETE_PRODUCT, REQUEST_PRODUCTS } from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import qs from "qs";
import { GetProductRequestParam, GetProductsResponse } from "../types/Products.ts";

function useAdminProduct() {

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

  /**
   * DELETE Product
   */

  const handleDeleteProduct = useMutation({
    mutationKey: ["delete-product"],
    mutationFn: (productId:string) => {
      return axios.delete(`${REQUEST_DELETE_PRODUCT}/${productId}`);
    },
  });

  const onDeleteProduct = (productId:string, onSuccess: () => void, onError:()=> void) => {
    handleDeleteProduct.mutate(productId, {
      onSuccess: onSuccess,
      onError: (error) => {
        console.log(error);
        onError()
      }
    });
  };

  return {
    getProducts,
    onDeleteProduct
  };
}

export default useAdminProduct;

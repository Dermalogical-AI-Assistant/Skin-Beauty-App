import { REQUEST_CREATE_PRODUCT, REQUEST_PRODUCTS } from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import {
  GetProductRequestParam,
  GetProductsResponse,
  Product,
  ReqCreateProduct,
  ResCreateProduct
} from "../types/Products.ts";
import qs from "qs";
import { useState } from "react";

function useProducts() {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCreateProduct = useMutation({
    mutationKey: ["create-product"],
    mutationFn: (data: ReqCreateProduct) => {
      return axios.post<ResCreateProduct>(REQUEST_CREATE_PRODUCT, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestCreateProduct = (
    data: ReqCreateProduct,
    onSuccess: (response: ResCreateProduct) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleCreateProduct.mutate(data, {
      onSuccess: (response) => {
        setIsLoading(false);
        onSuccess?.(response.data);
      },
      onError: (error) => {
        setIsLoading(false);
        console.log(error);
        onError(error);
      }
    });
  };

  const handleUpdateProduct = useMutation({
    mutationKey: ["update-product"],
    mutationFn: (params:{id:string, data: ReqCreateProduct}) => {
      return axios.put<ResCreateProduct>(`${REQUEST_CREATE_PRODUCT}/${params.id}`, params.data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestUpdateProduct = (
    data: { id:string, data:ReqCreateProduct },
    onSuccess: (response: ResCreateProduct) => void,
    onError: (error: Error) => void,
  ) => {
    setIsLoading(true);
    handleUpdateProduct.mutate(data, {
      onSuccess: (response) => {
        setIsLoading(false);
        onSuccess?.(response.data);
      },
      onError: (error) => {
        setIsLoading(false);
        console.log(error);
        onError(error);
      },
    });
  };

  return {
    isLoading,
    getProducts,
    getProductDetails,
    onRequestCreateProduct,
    onRequestUpdateProduct
  };
}

export default useProducts;

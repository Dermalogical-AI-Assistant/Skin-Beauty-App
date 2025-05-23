import {
  REQUEST_CREATE_ORDER,
  REQUEST_CREATE_SHIPPING_ADDRESS,
  REQUEST_MY_SHIPPING_ADDRESS,
  REQUEST_PRODUCTS
} from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { GetProductRequestParam, GetProductsResponse, Product } from "../types/Products.ts";
import qs from "qs";
import {
  GetShippingAddresRequestParam,
  GetShippingAddressResponse, ReqShippingAddress,
  ShippingAddress
} from "../types/ShippingAddress.ts";
import { ResOrder } from "../types/Order.ts";
import { useState } from "react";

function useShippingAddress() {
  const [isLoading, setIsLoading] = useState(false);

  const getMyShippingAddress = (params: GetShippingAddresRequestParam) => {
    return useQuery<GetShippingAddressResponse>({
      queryKey: ["ShippingAddress", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetShippingAddresRequestParam];
        console.log("paramss", params);
        const res = await axios.get(REQUEST_MY_SHIPPING_ADDRESS, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' })
          },});
        return res.data as GetShippingAddressResponse;
      },
      refetchOnWindowFocus: false,
    });
  };

  const handleAddShippingAddress = useMutation({
    mutationKey: ["add-shipping-address"],
    mutationFn: (data: ReqShippingAddress) => {
      return axios.post<ShippingAddress>(REQUEST_CREATE_SHIPPING_ADDRESS, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestAddShippingAdress = (
    data: ReqShippingAddress,
    onSuccess: (response:ReqShippingAddress) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleAddShippingAddress.mutate(data, {
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

  return {
    isLoading,
    getMyShippingAddress,
    onRequestAddShippingAdress
  };
}

export default useShippingAddress;

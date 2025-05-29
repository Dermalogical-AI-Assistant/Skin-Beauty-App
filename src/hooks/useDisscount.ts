import {
  REQUEST_ADMIN_CREATE_DISCOUNTS, REQUEST_ADMIN_DISCOUNT_DETAIL,
  REQUEST_ADMIN_DISCOUNTS,
  REQUEST_DISCOUNTS,
  REQUEST_PRODUCTS
} from "../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import {
  GetDiscountRequestParam,
  GetDiscountsResponse,
  Discount,
  ReqCreateDiscount,
  ResCreateDiscount
} from "../types/Discount";
import qs from "qs";
import { useState } from "react";

function useDiscount() {
  const [isLoading, setIsLoading] = useState(false);

  const getDiscounts = (params: GetDiscountRequestParam) => {
    return useQuery<GetDiscountsResponse>({
      queryKey: ["discount", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetDiscountRequestParam];
        const res = await axios.get<GetDiscountsResponse>(REQUEST_ADMIN_DISCOUNTS, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' }) // skincareConcerns=DRY_SKIN&skincareConcerns=ACNE
          },});
        return res.data as GetDiscountsResponse;
      },
      refetchOnWindowFocus: false,
    });
  };

  const getDiscountDetails = (id:string) => {
    return useQuery<Discount>({
      queryKey: ["discount", id],
      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey as [string, GetDiscountRequestParam];
        const res = await axios.get<Discount>(
          `${ REQUEST_ADMIN_DISCOUNT_DETAIL }/${ id }`);

        console.log(res.data);
        return res.data as Discount;
      },
      refetchOnWindowFocus: false,
    });
  };

  const handleCreateDiscount = useMutation({
    mutationKey: ["create-discount"],
    mutationFn: (data: ReqCreateDiscount) => {
      return axios.post<ResCreateDiscount>(REQUEST_ADMIN_CREATE_DISCOUNTS, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestCreateDiscount = (
    data: ReqCreateDiscount,
    onSuccess: (response: ResCreateDiscount) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleCreateDiscount.mutate(data, {
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

  const handleUpdateDiscount = useMutation({
    mutationKey: ["update-discount"],
    mutationFn: (params:{id:string, data: ReqCreateDiscount}) => {
      return axios.put<ResCreateDiscount>(`${REQUEST_CREATE_PRODUCT}/${params.id}`, params.data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestUpdateDiscount = (
    data: { id:string, data:ReqCreateDiscount },
    onSuccess: (response: ResCreateDiscount) => void,
    onError: (error: Error) => void,
  ) => {
    setIsLoading(true);
    handleUpdateDiscount.mutate(data, {
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
    getDiscounts,
    getDiscountDetails,
    onRequestCreateDiscount,
    onRequestUpdateDiscount
  };
}

export default useDiscount;

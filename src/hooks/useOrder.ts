import { useMutation, useQuery } from "@tanstack/react-query";
import {
  REQUEST_CREATE_ORDER,
  REQUEST_MY_ORDERS,
  REQUEST_ORDER_DETAIL, REQUEST_ORDERS,
  REQUEST_UPDATE_ORDER
} from "../constants/apis";
import axios from "../settings/axios";
import { useState } from "react";
import { GetOrdersRequestParam, Order, ResGetOrderById, ResOrder } from "../types/Order.ts";
import qs from "qs";
import { GenericResponseType } from "../types/common.ts";

type OrderItem = {
  productId: string;
  quantity: number;
  note: string;
}

export type ReqModifyOrder = {
  orderId: string;
  modifyData:{
    shippingAddressId:string;
    status:string;
    shippingFee:number;
    paymentMethod:string;
    paymentStatus:string;
  }

}

type ReqOrder = {
  orderItems: OrderItem[]
};

function useOrders (){

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = useMutation({
    mutationKey: ["create-orders"],
    mutationFn: (data: OrderItem[]) => {
      const dataOrder: ReqOrder = {
        orderItems:data
      }
      return axios.post<ResOrder>(REQUEST_CREATE_ORDER, dataOrder, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestOrder = (
    data: OrderItem[],
    onSuccess: (response:ResOrder) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleCreateOrder.mutate(data, {
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

  const handleUpdateOrder = useMutation({
    mutationKey: ["update-orders"],
    mutationFn: (data: ReqModifyOrder) => {
      return axios.put<ResOrder>(`${REQUEST_UPDATE_ORDER}/${data.orderId}`, data.modifyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const onRequestUpdateOrder = (
    data: ReqModifyOrder,
    onSuccess: (response:ResOrder) => void,
    onError: (error:Error) => void
  ) => {
    setIsLoading(true);
    handleUpdateOrder.mutate(data, {
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

  const useOrderById = (id:string) => {
    return useQuery<ResGetOrderById>({
      queryKey: ["order", id],
      queryFn: async ({ queryKey }) => {
        const [, id] = queryKey as [string, string];
        const res = await axios.get<ResGetOrderById>(
          `${ REQUEST_ORDER_DETAIL }/${ id }`);
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
  };

  const useMyOrders = (params: GetOrdersRequestParam) => {
    return useQuery<GenericResponseType<Order>>({
      queryKey: ["product", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetOrdersRequestParam];

        //drop status when status is undefined
        if (params.status === undefined || params.status === null) {
          delete params.status;
        }

        const res = await axios.get<GenericResponseType<Order>>(REQUEST_MY_ORDERS, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' }) // skincareConcerns=DRY_SKIN&skincareConcerns=ACNE
          },});
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
  };

  const useOrders = (params: GetOrdersRequestParam) => {
    return useQuery<GenericResponseType<Order>>({
      queryKey: ["get-order", params],
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as [string, GetOrdersRequestParam];

        //drop status when status is undefined
        if (params.status === undefined || params.status === null) {
          delete params.status;
        }

        const res = await axios.get<GenericResponseType<Order>>(REQUEST_ORDERS, {
          params,
          paramsSerializer: {
            serialize: (params) =>
              qs.stringify(params, { arrayFormat: 'repeat' }) // skincareConcerns=DRY_SKIN&skincareConcerns=ACNE
          },});
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
  };

  return {
    isLoading,
    onRequestOrder,
    onRequestUpdateOrder,
    useOrderById,
    useMyOrders,
    useOrders
  };
};

export default useOrders;

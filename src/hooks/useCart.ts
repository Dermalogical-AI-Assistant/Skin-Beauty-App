import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import { ReqCartItem } from "../types/Cart.ts";
import { REQUEST_ADD_PRODUCT_TO_CART } from "../constants/apis.ts";

function useCart() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpsetCart = useMutation({
    mutationKey: ["cart-upset"],
    mutationFn: async (data: ReqCartItem[]) => {
      const results = await Promise.all(
        data.map((item) =>
          axios.post(`${ REQUEST_ADD_PRODUCT_TO_CART }/${item.productId}`, item, {
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ),
      );
      return results;
    },
  });

  const onAddItemsToCart = async (
    data: ReqCartItem[],
    onSuccess: (results: any[]) => void,
    onError: (error: Error) => void
  ) => {
    setIsLoading(true);
    handleUpsetCart.mutate(data, {
      onSuccess: (results) => {
        setIsLoading(false);
        onSuccess?.(results);
      },
      onError: (error) => {
        setIsLoading(false);
        console.error(error);
        onError(error);
      },
    });
  };

  return {
    isLoading,
    onAddItemsToCart,
  };
}

export default useCart;

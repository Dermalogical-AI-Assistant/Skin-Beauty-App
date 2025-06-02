import { Product } from "./Products.ts";

export interface ReqCartItem {
    productId: string;
    quantity: number;
}


export type CartItem = {
    id: string;
    quantity: number;
    product: Product[]
}

export interface BasketItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
  currency?: string;
  addedAt?: string;
}
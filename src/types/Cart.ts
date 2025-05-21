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
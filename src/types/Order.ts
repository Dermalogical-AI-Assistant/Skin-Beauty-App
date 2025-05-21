import { ShippingAddress } from "./ShippingAddress.ts";
import { Product } from "./Products.ts";

export type OrderItem = {
  id: string;
  note: string;
  originalPrice: number;
  discountAmount: number;
  discounts: any[];
  finalPrice: number;
  product: Product;
  quantity: number;
}

export type Order = {
  id: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  totalDiscount: number;
  shippingFee: number;
  finalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  orderItems: OrderItem[];
}

export type ResOrder = {
  order: {
    id: string;
    shippingAddress: ShippingAddress;
    totalAmount: number;
    totalDiscount: number;
    shippingFee: number;
    finalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
  };
  orderItems: OrderItem[];
};

export type ResGetOrderById = Order

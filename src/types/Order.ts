import { ShippingAddress } from "./ShippingAddress.ts";
import { Product } from "./Products.ts";

export type OrderStatus = "DRAF" | "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELED";

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
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  orderItems: OrderItem[];
  createdAt: string;
}

export type ResOrder = {
  order: {
    id: string;
    shippingAddress: ShippingAddress;
    totalAmount: number;
    totalDiscount: number;
    shippingFee: number;
    finalAmount: number;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: string;
  };
  orderItems: OrderItem[];
};

export type GetMyOrdersRequestParam = {
    page: number;
    perPage: number;
    status?: OrderStatus;
}

export type ResGetOrderById = Order

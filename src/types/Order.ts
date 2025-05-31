import { ShippingAddress } from "./ShippingAddress.ts";
import { Product } from "./Products.ts";

export type OrderStatus = "DRAFT" | "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELED";

export enum E_OrderStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export enum E_OrderOrderBy {
  CREATED_AT = "createdAt",
  TOTAL_AMOUNT = "totalAmount",
  TOTAL_DISCOUNT = "totalDiscount",
  FINAL_AMOUNT = "finalAmount",
}

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
    status: E_OrderStatus;
    paymentMethod: string;
    paymentStatus: string;
  };
  orderItems: OrderItem[];
};

export type GetOrdersRequestParam = {
    page: number;
    perPage: number;
    order?: string;
    status?: E_OrderStatus;
}

export type ResGetOrderById = Order

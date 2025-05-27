import { OrderStatus } from "./Order.ts";

export type Comment = {
  id: string;
  images: string[];
  content: string;
  createdAt: string;
  parentId: string | null;
  parent: Comment | null;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  children: Comment[];
}

export type GetCommentsRequestParam = {
  page: number;
  perPage: number;
  order?: string;
  productId?: string;
}

export type ReqCreateComment = {
  productId: string;
  content: string;
  images?: string[];
  parentId?: string | null;
};


export type Comment = {
  id: string;
  content: string;
  images: string[];
  parentId: string | null;
  numberOfChildren: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export type GetCommentsRequestParam = {
  page: number;
  perPage: number;
  order?: string;
  parentId?: string;
  productId?: string;
}

export type ReqCreateComment = {
  productId: string;
  content: string;
  images?: string[];
  parentId?: string | null;
};


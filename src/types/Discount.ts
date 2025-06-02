import { E_SkincareConcern } from "./SkincareConcern.ts";
import { GenericResponseType } from "./common.ts";
import { E_Currency } from "./Currency.ts";

export type Discount = {
  id: string;
  title: string;
  description: string;
  discountType: E_DisscountType;
  discountValue: number;
  startTime: string;
  endTime: string;
  status: E_DisscountStatus;
  skincareConcerns: E_SkincareConcern[];
  minPrice: number;
  currency: "POUND";
  publishDate: string;
  createdAt: string;
}

export type GetDiscountsResponse = GenericResponseType<Discount>

export enum E_DisscountType {
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENT = "PERCENT",
}

export type ReqCreateDiscount = {
  title: string;
  description: string;
  discountType: E_DisscountType;
  discountValue: number;
  startTime: string;
  endTime: string;
  skincareConcerns: E_SkincareConcern[];
  minPrice: number;
  currency: E_Currency;
  publishDate: string;
};




export type ResCreateDiscount = {
  
};


export enum E_DisscountStatus {
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED"
}

export type GetDiscountRequestParam = {
    search?: string;
    status?: E_DisscountStatus[];
    skincareConcerns?: E_SkincareConcern[];
    discountTypes?: E_DisscountType;
    page?: number;
    perPage?: number;
    order?: number;
}